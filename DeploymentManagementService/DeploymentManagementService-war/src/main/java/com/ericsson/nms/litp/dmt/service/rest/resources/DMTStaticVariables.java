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

import com.fasterxml.jackson.databind.JsonNode;

/**
 * 
 * This class sets static variables for JSON structure.
 *
 */
public class DMTStaticVariables {
	protected static JsonNode rootJsonContainingProperties = null;
	protected static final int MAXDEPTH = 20;
	protected static final String CHILDREN = "children";
}
