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

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.io.IOException;

import org.apache.commons.httpclient.HttpClient;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpGet;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

public class LitpConnectorTest {
	
	HttpResponse response;
	
	@Mock
	HttpClient httpClientMock;
	
	@Mock
	HttpGet httpGetMock; 
	
	LitpConnector litpConnector = new LitpConnector();

	DMTServiceConfigCache dmtServiceConfigCache = new DMTServiceConfigCache();
	
	/**
	 * Setup LITPConnector
	 * @throws java.lang.Exception
	 */
	@Before
	public void setUp() throws Exception {
		MockitoAnnotations.initMocks(this);
		this.litpConnector.setServer("10.32.224.198");
		this.litpConnector.setPort(9999);
		this.litpConnector.setCallback("/show?attributes=['json']&verbose=d");
	}

	/**
	 * Test method for {@link com.ericsson.nms.litp.dmt.service.rest.resources.LitpConnector#getHttpConnection()}.
	 * @throws IOException 
	 * @throws ClientProtocolException 
	 */
//	@Test
	public void testGetHttpConnection() throws ClientProtocolException, IOException {
		response = litpConnector.getHttpConnection();
		assertEquals("HTTP/1.1 200 OK", response.getStatusLine().toString());
		assertNotNull(response);
	}

}
