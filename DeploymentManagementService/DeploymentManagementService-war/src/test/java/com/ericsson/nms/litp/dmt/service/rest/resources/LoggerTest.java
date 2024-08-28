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

import java.io.File;
import java.io.FileInputStream;

import javax.ws.rs.core.Response;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.powermock.api.mockito.PowerMockito.mock;
import static org.powermock.api.mockito.PowerMockito.mockStatic;
 
@RunWith(PowerMockRunner.class)
@PrepareForTest({DMTRestResource.class, LoggerFactory.class})
public class LoggerTest {
 
	DMTRestResource dmtRestResource = null;
	
	@Mock
	LitpConnector litpConnectorMock;
	
	@Mock
	HttpResponse responseMock;
	
	@Mock
	HttpEntity httpEntity;
	
	@Mock
	Response response;
	
	FileInputStream fis;
	
	Logger logger;
    
	/**
	 * @throws java.lang.Exception
	 */
	@Before
	public void setUp() throws Exception {
		mockStatic(LoggerFactory.class);
        logger = mock(Logger.class);
        when(LoggerFactory.getLogger(DMTRestResource.class)).thenReturn(logger);
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
	
	@Test
    public void testLoggingInvalidPath() throws Exception {
		dmtRestResource.getNodeProperties("childfrujgujrion/dkkd");
        verify(logger).warn("invalid path");
    }
}