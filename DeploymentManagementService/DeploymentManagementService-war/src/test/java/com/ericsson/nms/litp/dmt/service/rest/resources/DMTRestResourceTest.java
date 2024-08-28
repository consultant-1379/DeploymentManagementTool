/*------------------------------------------------------------------------------
 *******************************************************************************
 * COPYRIGHT Ericsson 2012
 *
 * The copyright to the computer program(s) herein is the property of
 * Ericsson Inc. The programs may be used and/or copied only with written
 * permission from Ericsson Inc. or in accordance with the terms and
 * conditions stipulated in the agreement/contract under which the
 * program(s) have been supplied.
 *******************************************************************************
 *----------------------------------------------------------------------------*/
package com.ericsson.nms.litp.dmt.service.rest.resources;

import static org.junit.Assert.*;
import static org.mockito.Mockito.when;

import java.io.*;
import java.util.*;
import java.util.Map.Entry;
import javax.ws.rs.core.Response;
import net.minidev.json.JSONObject;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.junit.*;
import org.mockito.*;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class DMTRestResourceTest {
	DMTRestResource dmtRestResource = null;
	JsonNode root = null;
	JsonNode jsonNodeDefinitionInventory = null;

	ObjectMapper mapperMock = null;
	InputStreamReader inputStreamReaderMock = null;
	HttpEntity entityMock = null;
	
	@Mock
	InputStream inputStreamMock = null;

	@Mock
	LitpConnector litpConnectorMock;

	@Mock
	HttpResponse responseMock;

	@Mock
	HttpEntity httpEntity;

	@Mock
	InputStream inputStream;

	@Mock
	ObjectMapper objectMapper;

	@Mock
	InputStreamReader inputStreamReader;

	@Mock
	JsonNode jsonNode;

	@Mock
	Response response;

	FileInputStream fis;

	/**
	 * @throws java.lang.Exception
	 */
	@Before
	public void setUp() throws Exception {
		dmtRestResource = new DMTRestResource();
		File currentDirectory = new File(new File(".").getAbsolutePath());
		fis = new FileInputStream(
				currentDirectory.getAbsolutePath()
						+ "//src//test//java//com//ericsson//nms//litp//dmt//service//rest//resources//test.json");
		MockitoAnnotations.initMocks(this);
		dmtRestResource.setConnector(litpConnectorMock);
		when(litpConnectorMock.getHttpConnection()).thenReturn(responseMock);
		when(responseMock.getEntity()).thenReturn(httpEntity);
		when(httpEntity.getContent()).thenReturn(fis);
		response = dmtRestResource.loadDeploymentModel();		
	}

	/**
	 * @throws java.lang.Exception
	 */
	@After
	public void tearDown() throws Exception {
	}

	@Test
	public void testGetjson() throws ClientProtocolException, IOException {		
		ObjectMapper mapper = new ObjectMapper();
		JsonNode jsonNode = mapper.readTree(response.getEntity().toString());
		Iterator<Entry<String, JsonNode>> fieldsIter = jsonNode.fields();

		while (fieldsIter.hasNext()) {
			final Entry<String, JsonNode> field = fieldsIter.next();
			final String fullName = field.getKey();
			assertFalse(fullName.equals("allocated"));
			assertFalse(fullName.equals("applied"));
			assertFalse(fullName.equals("applying"));
			final List<String> includedBranchList = new ArrayList<String>();
			includedBranchList.add("definition");
			includedBranchList.add("inventory");
			includedBranchList.add("data");
			assertTrue(includedBranchList.contains(fullName));
			assertFalse(fullName.equals("bootmgr"));
			assertFalse(fullName.equals("cfgmgr"));
		}
	}
	
	@Test
	public void testGetStatus() throws ClientProtocolException, JsonProcessingException, IOException{
		
        Response res = dmtRestResource.getNodeProperties("children/definition");
        
        assertEquals(200, res.getStatus());
                
        String jsonString = res.getEntity().toString();
                
        JSONObject jsonObject = new ObjectMapper().readValue(jsonString, JSONObject.class);

        String status = jsonObject.get("status").toString();
        String statusHistory = jsonObject.get("status_history").toString();
        String id = jsonObject.get("id").toString();
        String properties = jsonObject.get("properties").toString();
        String configuration = jsonObject.get("configuration").toString();
     
        assertTrue(jsonObject instanceof Object);
        assertTrue(statusHistory.equals("[]"));                      
	    assertTrue(status.equals("Initial"));
	    assertTrue(id.equals("definition"));
	    assertTrue(status.equals("Initial"));
	    assertTrue(properties.contains("require"));
	    assertTrue(configuration.equals("[]"));
	}
	
}
