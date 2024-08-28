/*------------------------------------------------------------------------------
 *******************************************************************************
 * COPYRIGHT Ericsson 2013
 *
 * The copyright to the computer program(s) herein is the property of
 * Ericsson Inc. The programs may be used and/or copied only with written
 * permission from Ericsson Inc. or in accordance with the terms and
 * conditions stipulated in the agreement/contract under which the
 * program(s) have been supplied.
 *******************************************************************************
 *----------------------------------------------------------------------------*/
package com.ericsson.nms.litp.dmt.service.rest;

import javax.servlet.annotation.WebFilter;
import javax.servlet.annotation.WebInitParam;

import org.jboss.resteasy.plugins.server.servlet.FilterDispatcher;

/**
 * A class to initialize the Rest WebService with Servlet 3.0 annotations.
 * 
 * 
 */
@WebFilter(filterName = "restfilter", urlPatterns = { "/*" }, initParams = { @WebInitParam(name = "resteasy.scan", value = "true") })
public class MainDispatcher extends FilterDispatcher {
}
