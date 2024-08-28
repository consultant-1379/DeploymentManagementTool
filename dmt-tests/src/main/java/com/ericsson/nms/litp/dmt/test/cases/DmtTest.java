package com.ericsson.nms.litp.dmt.test.cases;

import java.util.List;

import javax.inject.Inject;

import org.json.JSONException;
import org.json.JSONObject;
import org.testng.annotations.Test;

import com.ericsson.cifwk.taf.TestCase;
import com.ericsson.cifwk.taf.TorTestCaseHelper;
import com.ericsson.cifwk.taf.annotations.*;
import com.ericsson.cifwk.taf.guice.OperatorRegistry;
import com.ericsson.cifwk.taf.tal.rest.RestResponseCode;
import com.ericsson.cifwk.taf.tools.RestTool;
import com.ericsson.nms.litp.dmt.test.operators.DmtOperator;
import com.ericsson.nms.litp.dmt.test.operators.DmtUiOperator;
import com.jayway.jsonpath.InvalidPathException;
import com.jayway.jsonpath.JsonPath;

public class DmtTest extends TorTestCaseHelper implements TestCase {

	@Inject
	private OperatorRegistry<DmtUiOperator> dmtUIProvider;

	@Inject
	private OperatorRegistry<DmtOperator> dmtRestProvider;

	@TestId(id = "verifyNavigationBarSearchDisplaysPropertyAsExpected", title = "Verify navigation bar search displays property as expected")
	@Context(context = { Context.UI })
	@Test
	@DataDriven(name = "navigation_enter")
	public void verifyNavigationBarSearchDisplaysPropertyAsExpected(
			@Input("initialPath") String initialPath,
			@Output("expected") String expected) {

		DmtUiOperator dmt = getUIOperator();
		String name = dmt.enterPath(initialPath);
		assertEquals(expected, name);
	}

	@TestId(id = "verifyPathOpensAsExpected", title = "Verify path opens")
	@Context(context = { Context.UI })
	@Test
	@DataDriven(name = "tree_path")
	public void verifyPathOpensAsExpected(
			@Input("initialPath") String initialPath,
			@Output("expectedChildren") String expected) {
		DmtUiOperator dmt = getUIOperator();
		String result = dmt.openTree(initialPath, expected);
		assertEquals(expected, result);
	}

	@TestId(id = "verifyOnLabelClickedPropertiesDisplay", title = "Verify when a node label is clicked its properties are displayed")
	@Context(context = { Context.UI })
	@Test
	@DataDriven(name = "select_node")
	public void verifyOnLabelClickedPropertiesDisplay(
			@Input("nodeName") String nodeName,
			@Output("expected") String expected) {
		DmtUiOperator dmt = getUIOperator();
		String propertyHeader = dmt.verifyIfPropertiesAreDisplayed(nodeName);
		assertEquals(expected, propertyHeader);
	}

	@TestId(id = "verifyNavigationBarAutoSuggest", title = "Verify user can navigate to a specific node using the navigation bar auto suggest")
	@Context(context = { Context.UI })
	@Test
	@DataDriven(name = "navigation_autosuggest")
	public void verifyNavigationBarAutoSuggest(
			@Input("inputText") String inputText,
			@Output("expectedChildren") String expectedChildren) {
		DmtUiOperator dmt = getUIOperator();
		dmt.enterPath(inputText, 1000);
		String result = dmt.getNavigationResultsPane(1000);
		assertEquals(expectedChildren, result);
	}

	@TestId(id = "taftest19-func-1", title = "Verify that we can retrieve properties")
	@Context(context = { Context.REST })
	@Test(enabled = true)
	@DataDriven(name = "dmt_rest_property")
	public void verifyWeCanRetrieveTheProperties(
			@Input("propertyURL") String propertyURL,
			@Input("property") String property,
			@Output("expectedResponseCode") String expectedResponseCode,
			@Output("expectedValue") String expectedValue) throws JSONException {

		DmtOperator dmtRest = getRestOperator();
		RestTool result = dmtRest.retrieveRestData();
		List<String> response = result.get(propertyURL);

		List<RestResponseCode> responseCodes = result.getLastResponseCodes();

		String jsonString = response.get(0);
		JSONObject jsonObject = new JSONObject(jsonString);

		// Tests the response codes of each REST call
		assertEquals(expectedResponseCode, responseCodes.get(0).toString());

		// Tests objects in the REST response
		assertEquals(expectedValue, jsonObject.get(property).toString());
	}

	@TestId(id = "taftest20-func-1", title = "Verify that we can retrieve the model")
	@Context(context = { Context.REST })
	@Test(enabled = true)
	@DataDriven(name = "dmt_rest_model")
	public void verifyWeCanRetrieveTheModel(@Input("path") String path,
			@Input("modelURL") String modelURL,
			@Output("expectedResponseCode") String expectedResponseCode,
			@Output("expectedObject") String expectedObject)
			throws JSONException {
		DmtOperator dmtRest = getRestOperator();
		RestTool result = dmtRest.retrieveRestData();
		List<String> response = result.get(modelURL);
		String modelTestProperty = "";

		String jsonString = response.get(0);

		try {
			modelTestProperty = JsonPath.read(jsonString, "$." + path)
					.toString();

		} catch (final InvalidPathException e) {
			System.out.println(e.getMessage());
		}

		List<RestResponseCode> responseCodes = result.getLastResponseCodes();

		// Tests the response codes of each REST call
		assertEquals(expectedResponseCode, responseCodes.get(0).toString());

		// Tests that a certain property is present in the response
		assertEquals(expectedObject, modelTestProperty);
	}

	private DmtOperator getRestOperator() {
		return dmtRestProvider.provide(DmtOperator.class);
	}

	private DmtUiOperator getUIOperator() {
		return dmtUIProvider.provide(DmtUiOperator.class);
	}
}
