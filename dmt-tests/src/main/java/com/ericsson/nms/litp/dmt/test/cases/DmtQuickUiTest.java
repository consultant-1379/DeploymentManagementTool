package com.ericsson.nms.litp.dmt.test.cases;

import org.testng.Assert;
import org.testng.annotations.Test;

import com.ericsson.cifwk.taf.TestCase;
import com.ericsson.cifwk.taf.TorTestCaseHelper;
import com.ericsson.cifwk.taf.annotations.*;
import com.ericsson.nms.litp.dmt.test.operators.DmtUiOperator;

// For testware check purposes
public class DmtQuickUiTest extends TorTestCaseHelper implements TestCase {
	private DmtUiOperator dmtOperator;

	@TestId(id = "verifyModelExists", title = "Verifies if the model exist")
	@VUsers(vusers = { 1 })
	@Context(context = { Context.UI })
	@Test(enabled = true)
	public void verifyModelExists() {
		dmtOperator = new DmtUiOperator();
		String result = dmtOperator.getRoot();
		Assert.assertEquals("/", result);
	}

	@TestId(id = "enterNavigationPath", title = "Verifies that the navigation path works")
	@VUsers(vusers = { 1 })
	@Context(context = { Context.UI })
	@Test(enabled = true)
	public void enterNavigationPath() {
		dmtOperator = new DmtUiOperator();
		String name = dmtOperator.enterPath("/definition/");
		Assert.assertEquals("definition", name);
	}

	@TestId(id = "verifyPropertyOpens", title = "Verifies that the property pane works")
	@VUsers(vusers = { 1 })
	@Context(context = { Context.UI })
	@Test(enabled = true)
	public void verifyPropertyOpens() {
		dmtOperator = new DmtUiOperator();
		String name = dmtOperator.selectNodeLabel("definition");
		if (name != null) {
			String property = dmtOperator.openProperty();
			Assert.assertEquals("__module__ core.litp_definition", property);
		} else {
			Assert.assertEquals(null, name);
		}
	}

	@TestId(id = "infoButtonRestoresHelpboxToScreen", title = "Verifies that the info box launches")
	@VUsers(vusers = { 1 })
	@Context(context = { Context.UI })
	@Test(enabled = true)
	public void infoButtonRestoresHelpboxToScreen() {
		dmtOperator = new DmtUiOperator();
		Boolean isPopupDisplayed = dmtOperator.restoreInfoBoxToPage();
		Assert.assertTrue(isPopupDisplayed);
	}

	@TestId(id = "verifyPropertyCloses", title = "Verifies that the property widget closes correctly in the property Pane")
	@VUsers(vusers = { 1 })
	@Context(context = { Context.UI })
	@Test(enabled = true)
	public void verifyPropertyCloses() {
		dmtOperator = new DmtUiOperator();
		String name = dmtOperator.selectNodeLabel("inventory");
		if (name != null) {
			String property = dmtOperator.closeProperty();
			Assert.assertEquals("", property);
		} else {
			Assert.assertEquals(null, name);
		}
	}

	@TestId(id = "verifyZoomingIntoTree", title = "Verifies that the zoom in capability works")
	@VUsers(vusers = { 1 })
	@Context(context = { Context.UI })
	@Test(enabled = true)
	public void verifyZoomingIn() {
		dmtOperator = new DmtUiOperator();
		Assert.assertTrue(dmtOperator.confirmZoomIn());
	}

	@TestId(id = "verifyZoomingOutOfTree", title = "Verifies that the zoom out capability works")
	@VUsers(vusers = { 1 })
	@Context(context = { Context.UI })
	@Test(enabled = true)
	public void verifyZoomingOut() {
		dmtOperator = new DmtUiOperator();
		Assert.assertTrue(dmtOperator.confirmZoomOut());
	}

	@TestId(id = "verifyPanningWorks", title = "Verifies that PAN functionality works.")
	@VUsers(vusers = { 1 })
	@Context(context = { Context.UI })
	@Test(enabled = true)
	public void verifyPanningWorks() {
		dmtOperator = new DmtUiOperator();

		dmtOperator.panLeft();
		dmtOperator.panLeft();
		dmtOperator.panLeft();
		Boolean panLeftPosition = dmtOperator.confirmPan("left", 75);

		dmtOperator.panRight();
		dmtOperator.panRight();
		Boolean panRightPosition = dmtOperator.confirmPan("right", 200);

		Assert.assertTrue(panLeftPosition);
		Assert.assertTrue(panRightPosition);
	}

	@TestId(id = "verifyRepositionTreeWorks", title = "Verifies that the repostion tree button works")
	@VUsers(vusers = { 1 })
	@Context(context = { Context.UI })
	@Test(enabled = true)
	public void verifyRepositionTreeWorks() {
		dmtOperator = new DmtUiOperator();

		dmtOperator.panLeft();
		Boolean panLeftPosition = dmtOperator.confirmPan("left", 70);

		dmtOperator.repositionTree();
		String resetPosition = dmtOperator.getRootPosition();

		Assert.assertTrue(panLeftPosition);
		Assert.assertEquals("translate(9,300)", resetPosition);

	}
}
