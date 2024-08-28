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

import java.io.IOException;

import javax.inject.Inject;

import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;

import com.ericsson.oss.itpf.sdk.config.annotation.Configured;

/**
 * 
 * Takes the server details from DMTServiceConfigCache and 
 * sets up the connection to the LITP server
 */
public class LitpConnector {

	@Inject @Configured(propertyName = "DMT.litp_rest_server")
	private String litp_rest_ser;
	
	@Inject @Configured(propertyName = "DMT.litp_rest_callback")
	private String litp_rest_call;

	@Inject @Configured(propertyName = "DMT.litp_rest_server_port")
	private Integer litp_rest_pt;
	
	
	private HttpClient client = null;

	/**
	 * Responsible for setting up connection to the LITP server and retrieving
	 * the LITP response.
	 * 
	 * @return the LITP response
	 * @return the LITP IP Address response
	 * @throws IOException
	 * @throws ClientProtocolException
	 */	
	public HttpResponse getHttpConnection() throws IOException, ClientProtocolException {
		client = new DefaultHttpClient();
		final String urlstr = "http://"+ getServer();
		final HttpGet request = new HttpGet(urlstr);
		request.setHeader("content-length", "0");
		final HttpResponse response = client.execute(request);
		return response;
	}
	
	void closeConnections(){
		 // When HttpClient instance is no longer needed,
	     // shut down the connection manager to ensure
	     // immediate deallocation of all system resources
		if(client!=null){
			client.getConnectionManager().shutdown();
		}
	}

	private String getServer() {
		final String litp_address = litp_rest_ser + ":" + litp_rest_pt + litp_rest_call;
		return litp_address;
	}

	/**
	 * This method is only for Test purpose only
	 */
	void setServer(final String server){
		this.litp_rest_ser = server;
	}

	/**
	 * This method is only for Test purpose only
	 */
	void setCallback(final String callback){
		this.litp_rest_call = callback;
	}

	/**
	 * This method is only for Test purpose only.
	 */
	void setPort(final int port){
		this.litp_rest_pt = port;
	}
}
