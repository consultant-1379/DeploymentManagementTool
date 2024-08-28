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

import java.io.*;
import java.util.*;
import java.util.Map.Entry;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import net.minidev.json.JSONObject;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.jayway.jsonpath.InvalidPathException;
import com.jayway.jsonpath.JsonPath;


/**
 * 
 * This class receives HTTP requests from 
 * the DMTUI and returns a JSON response. 
 * 
 */
@Path("/dmtservice")
@Produces(MediaType.APPLICATION_JSON)
public class DMTRestResource {
	
	// the service that returns the model
	private LitpConnector connector;
	
	private InputStream content;
	
	private static final Logger LOG = LoggerFactory.getLogger(DMTRestResource.class);
 	
	/**
	 * Sets the LITP connector to be used by the HTTP Interface.
	 * @param connector the LitpConnector to set
	 */
	@Inject
	public void setConnector(final LitpConnector connector) {
		this.connector = connector;
	}

	@Path("/model")
	@GET
	/**
	 * Returns the JSON content that is to be displayed in the Map View. 
	 * @return JSON content that is to be displayed. 
	 * @throws ClientProtocolException Signals an error in the HTTP protocol
	 * @throws JsonProcessingException Encountered when processing (parsing, generating) JSON content that are not pure I/O problems. 
	 * @throws IOException  Signals that an I/O exception of some sort has occurred.
	 */
	public Response loadDeploymentModel() throws ClientProtocolException,
			JsonProcessingException, IOException {
		return getJson();
	}
	
	/**
	 * Responsible for retrieving the JSON object that is to be displayed in the
	 * browser map view.
	 * 
	 * @return the JSON node that is to be displayed.
	 * @throws ClientProtocolException
	 * @throws IOException
	 */
	private Response getJson() throws ClientProtocolException, IOException,
			JsonProcessingException {
		final ObjectMapper mapper = new ObjectMapper();
		JsonNode root = null;
		JsonNode rootWithoutProperties = null;
		
		// get connection to LITP
		final HttpResponse response = connector.getHttpConnection();

		// read in the JSON content
		final HttpEntity entity = response.getEntity();
		
		if(entity!=null){
			try{
				content = entity.getContent();
				final InputStreamReader reader = new InputStreamReader(content);
				root = mapper.readTree(reader);
			}finally{
				 // Closing the input stream will trigger connection release
				 content.close();
			}
		}
		
		connector.closeConnections();

		// get the children branches branch. stored globally as this JSON object contains properties that will be used later
		DMTStaticVariables.rootJsonContainingProperties = getChildrenBranches(root);

		final JsonNode tree = DMTStaticVariables.rootJsonContainingProperties.deepCopy();

		// remove unwanted properties and objects..
		rootWithoutProperties = removeProperties(tree, DMTStaticVariables.MAXDEPTH);

		// add the JSON data within another data object... UI expecting it in
		// the format.
		final ObjectNode jNode = mapper.createObjectNode();
		jNode.set("data", rootWithoutProperties);
		// return the response object containing JSON to be displayed on the
		// browser
		return Response.ok(mapper.writeValueAsString(jNode)).build();
	}
		
	
	 @GET
     @Produces(MediaType.APPLICATION_JSON)
     @Path("/properties({path:.+})")
	/**
	 * Responsible for retrieving the properties for the selected Node element in the UI
	 * 
	 * This method takes in the id from the URL path. It also retrieves the raw JSON data from the LITP server 
	 * and it calls the get Status method and passes in the JSON data and the id for the path.
	 * The :.+ in @Path allows the "/" to be included in the variable string.
	 * 
	 * @param path The path for which the property is to be retrieved for
	 * @return the list of properties to be displayed
	 */
	 public Response getNodeProperties(@PathParam("path") final String path) throws InvalidPathException{
		 // converts the "/" to a "."
		 final String pathWithDots = path.replaceAll("/", ".");
		 final JSONObject statusToJson = new JSONObject();
		 // Log a warning when the JSON path is incorrect
		 try {
			 final String jsonDataAtPath = JsonPath.read(
					 DMTStaticVariables.rootJsonContainingProperties.toString(),
					 "$." + pathWithDots).toString();
			 final JSONObject jsonForSelectedNode = JsonPath.read(jsonDataAtPath, "$.");
			 final Set<String> keySetArray = jsonForSelectedNode.keySet();
			 keySetArray.remove("children");
			 for (final String key : keySetArray) {
				 statusToJson.put(key, JsonPath.read(jsonDataAtPath, "$." + key));
			 }
		 } catch (final InvalidPathException e) {
			 LOG.warn(e.getMessage());
		 }
		 return Response.status(200).entity(statusToJson).build();
	 }

	/**
	 * Responsible for filtering out all objects except children
	 * branches.
	 * 
	 * @param root
	 *            The JSON root JsonNode
	 * @return The JSON content with only the children branches.
	 */
	private JsonNode getChildrenBranches(final JsonNode root) {
		final Iterator<Entry<String, JsonNode>> fieldsIter = root.fields();
		final String children = DMTStaticVariables.CHILDREN;
		while (fieldsIter.hasNext()) {
			final Entry<String, JsonNode> field = fieldsIter.next();
			final String fullName = field.getKey();
			if (!children.contains(fullName)) {
				fieldsIter.remove();
				continue;
			}
		}
		return root;
	}
	
	/**
	 * Responsible for removing all properties, arrays containing properties,
	 * returning the root node containing the main objects.
	 * 
	 * @param root
	 *            the JSON Root node
	 * @param maxDepth
	 *            the maxDepth
	 * @return JSON object with properties removed.
	 */
	private JsonNode removeProperties(final JsonNode root, final int maxDepth) {
		final Iterator<Entry<String, JsonNode>> fieldsIter = root.fields();
		while (fieldsIter.hasNext()) {
			final Entry<String, JsonNode> field = fieldsIter.next();
			final boolean isObject = field.getValue().isObject();
			final boolean isArray = field.getValue().isArray();
			if ((!isObject) || (isArray && maxDepth >= 0)) {
				fieldsIter.remove();
				continue;
			}
			removeProperties(field.getValue(), maxDepth - 1);
		}
		return root;
	}
	
}