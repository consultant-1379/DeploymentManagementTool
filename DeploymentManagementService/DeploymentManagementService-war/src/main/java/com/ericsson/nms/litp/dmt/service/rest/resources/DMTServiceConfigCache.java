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

import com.ericsson.oss.itpf.sdk.modeling.annotation.DefaultValue;
import com.ericsson.oss.itpf.sdk.modeling.config.annotation.*;
import com.ericsson.oss.itpf.sdk.modeling.constraints.annotation.NotNull;

/**
 * Responsible for injecting default server IP address 
 * settings into the LITP Connector
 */
@ModeledConfigurationDefinition
public class DMTServiceConfigCache {
	/**
	 * @param connector
	 *            the LitpConnector port to set
	 */
	@NotNull
    @ModeledConfigurationParameter(name="DMT.litp_rest_server_port", description="Port", 
    scope=ConfigurationParameterScope.GLOBAL)
    @DefaultValue("9999")
    public Integer portNumber;
    
	/**
	 * @param connector
	 *            the LitpConnector IP address to set
	 */
    @NotNull
    @ModeledConfigurationParameter(name="DMT.litp_rest_server", description="IP Address", 
    scope=ConfigurationParameterScope.GLOBAL)
    @DefaultValue("ms1")
    public String ipAddress;
    
    /**
	 * @param connector
	 *            the LitpConnector callback to set
	 */
    @NotNull
    @ModeledConfigurationParameter(name="DMT.litp_rest_callback", description="Callback command to get the JSON tree structure",
    scope=ConfigurationParameterScope.GLOBAL)
    @DefaultValue("/show?attributes=['json']&verbose=d")
    public String callback;
}
