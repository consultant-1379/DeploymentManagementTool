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
package com.ericsson.nms.litp.dmt.test.operators;

import java.util.Map;

import javax.inject.Singleton;

import com.ericsson.cifwk.taf.UiOperator;
import com.ericsson.cifwk.taf.annotations.Context;
import com.ericsson.cifwk.taf.annotations.Operator;
import com.ericsson.cifwk.taf.data.*;
import com.ericsson.cifwk.taf.ui.sdk.*;
import com.ericsson.nms.litp.dmt.test.pages.DmtViewModel;

@Operator(context = Context.UI)
@Singleton
// implements DmtOperator
public class DmtUiOperator implements UiOperator {
	private final Browser browser;
	private final BrowserTab browserTab;
	private DmtViewModel dmtView;

	public DmtUiOperator() {
		String url = getCalcUrl();
		this.browser = UI.newBrowser(BrowserType.FIREFOX);
		this.browserTab = browser.open(url);
		this.dmtView = browserTab.getView(DmtViewModel.class);
	}

	private String getCalcUrl() {
		Host calcHost = DataHandler.getHostByName("dmt");
		String uri = (String) DataHandler.getAttribute("dmt.web.uri");
		Map<Ports, String> portMap = calcHost.getPort();
		String calcPort = portMap.get(Ports.HTTP);
		if (calcPort == null) {
			throw new IllegalArgumentException(
					"HTTP port not defined for host 'dmt'");
		}

		return String.format("http://%s:%s%s", calcHost.getIp(), calcPort, uri);
	}

	public String enterPath(String path) {
		return enterNavigationPath(path);
	}

	private String enterNavigationPath(String path) {
		String result = dmtView.enterPath(path);
		return result;
	}

	public String openTree(String path, String child) {
		String result = dmtView.openTree(path, child);
		return result;
	}

	public String getRoot() {
		return dmtView.getRoot();
	}

	public String selectNodeLabel(String nodeLabel) {
		String result = dmtView.selectNodeLabel(nodeLabel);
		return result;
	}

	public String openProperty() {
		String result = dmtView.openProperty();
		return result;
	}

	public String closeProperty() {
		String result = dmtView.closeProperty();
		return result;
	}

	public Boolean restoreInfoBoxToPage() {
		return dmtView.restoreInfoBoxToPage();
	}

	public String verifyIfPropertiesAreDisplayed(String nodeName) {
		return dmtView.verifyIfPropertiesAreDisplayed(nodeName);
	}

	public String getRootPosition() {
		return dmtView.getRootPosition();
	}

	public void repositionTree() {
		dmtView.repositionTree();
	}

	public void panLeft() {
		dmtView.panLeft();
	}

	public void panRight() {
		dmtView.panRight();
	}

	public void enterPath(String path, int pause) {
		dmtView.enterPath(path, pause);
	}

	public String getPropertyHeaderName(int pause) {
		return dmtView.getPropertyHeaderName(pause);
	}

	public String getNavigationResultsPane(int pause) {
		return dmtView.getNavigationResultsPane(pause);
	}

	public Boolean confirmZoomIn() {
		return dmtView.confirmZoomIn();
	}

	public Boolean confirmZoomOut() {
		return dmtView.confirmZoomOut();
	}

	public Boolean confirmPan(String panDirection, int i) {
		return dmtView.confirmPanDirection(panDirection, i);
	}
}