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
package com.ericsson.nms.litp.dmt.test.pages;

import java.util.List;

import com.ericsson.cifwk.taf.ui.*;
import com.ericsson.cifwk.taf.ui.sdk.*;

public class DmtViewModel extends ViewModel {

	@UiComponentMapping(".eaDMT-wTree-node-root")
	private Label root;

	@UiComponentMapping(".eaDMT-wNavigation-input")
	private TextBox navigationBarInput;

	@UiComponentMapping(".eaDMT-wNavigation-button")
	private Button navigationBarButton;

	@UiComponentMapping(".eaDMT-wPropertyHeader-nodeName")
	private Label propertyHeaderName;

	@UiComponentMapping(".eaDMT-wTree-node-textLabel")
	private List<UiComponent> resultRows;

	@UiComponentMapping(".eaDMT-wTree-node-gCircle")
	private List<UiComponent> nodes;

	@UiComponentMapping("#general_properties>.eaDMT-wListItem")
	private List<UiComponent> generalProperties;

	@UiComponentMapping(".eaDMT-wButtonItem-button")
	private Button propertyButton;

	@UiComponentMapping(".ebIcon_info")
	private Button infoButton;

	@UiComponentMapping(".ebInfoPopup-content")
	private Label infoPopupContent;

	@UiComponentMapping(".ebBtn_color_darkBlue")
	private Button infoPopupCloseButton;

	@UiComponentMapping(".eaDMT-wPanLeft-button")
	private Button panLeftButton;

	@UiComponentMapping(".eaDMT-wPanRight-button")
	private Button panRightButton;

	@UiComponentMapping(".eaDMT-wRepositionTree-button")
	private Button repositionTreeButton;

	@UiComponentMapping(".eaDMT-wNavigation-resultsPane")
	private Label navigationResultsPane;

	@UiComponentMapping(".eaDMT-wZoomControl-zoomIn-button")
	private Button zoomInButton;

	@UiComponentMapping(".eaDMT-wZoomControl-zoomOut-button")
	private Button zoomOutButton;

	@UiComponentMapping(".eaDMT-wTree-node")
	private List<UiComponent> nodeList;

	public DmtViewModel(UiMediator mediator,
			UiComponentAutowirer componentInitializer) {
		super(mediator, componentInitializer);
	}

	public String enterPath(String path) {
		UI.pause(2000);
		navigationBarInput.setText(path);
		navigationBarButton.click();
		UI.pause(2000);
		return propertyHeaderName.getText();
	}

	public void enterPath(String path, int pause) {
		UI.pause(pause);
		navigationBarInput.setText(path);
	}

	public void clickNavigationButton() {
		navigationBarButton.click();
	}

	public void clickZoomInButton() {
		zoomInButton.click();
	}

	public void clickZoomOutButton() {
		zoomOutButton.click();
	}

	public Boolean confirmZoomIn() {
		double initialNodeOnePosition = findNodePosition(nodeList.get(1));
		double initialNodeTwoPosition = findNodePosition(nodeList.get(nodeList
				.size() - 1));
		double initialDistance = distanceBetweenNodes(initialNodeOnePosition,
				initialNodeTwoPosition);
		clickZoomInButton();
		double finalNodeOnePosition = findNodePosition(nodeList.get(1));
		double finalNodeTwoPosition = findNodePosition(nodeList.get(nodeList
				.size() - 1));
		double finalDistance = distanceBetweenNodes(finalNodeOnePosition,
				finalNodeTwoPosition);
		if (finalDistance > initialDistance) {
			return true;
		}
		return false;
	}

	public Boolean confirmZoomOut() {
		clickZoomInButton();
		UI.pause(1000);
		double initialNodeOnePosition = findNodePosition(nodeList.get(1));
		double initialNodeTwoPosition = findNodePosition(nodeList.get(nodeList
				.size() - 1));
		double initialDistance = distanceBetweenNodes(initialNodeOnePosition,
				initialNodeTwoPosition);
		clickZoomOutButton();
		UI.pause(1000);
		double finalNodeOnePosition = findNodePosition(nodeList.get(1));
		double finalNodeTwoPosition = findNodePosition(nodeList.get(nodeList
				.size() - 1));
		double finalDistance = distanceBetweenNodes(finalNodeOnePosition,
				finalNodeTwoPosition);
		if (finalDistance < initialDistance) {
			return true;
		}
		return false;
	}

	private double findNodePosition(UiComponent nodeCoordinates) {
		String coordinateString = nodeCoordinates.getProperty("transform")
				.split(",")[1];
		double nodePosition = Double.parseDouble(coordinateString.substring(0,
				coordinateString.length() - 1));
		return nodePosition;
	}

	private double distanceBetweenNodes(double nodeOnePosition,
			double nodeTwoPosition) {
		double distance = 0;
		if (nodeOnePosition > 0) {
			distance = nodeTwoPosition - nodeOnePosition;
		} else {
			distance = nodeTwoPosition + Math.abs(nodeOnePosition);
		}
		return distance;
	}

	public String getPropertyHeaderName(int pause) {
		UI.pause(pause);
		return propertyHeaderName.getText();
	}

	public String getNavigationResultsPane(int pause) {
		UI.pause(pause);
		String navigationResults = navigationResultsPane.getText();
		String result = navigationResults.replaceAll("\n", "");
		return result;
	}

	public String openTree(String path, String child) {
		UI.pause(2000);
		String pathResult = path.substring(1, path.length() - 1);
		String[] pathArray = pathResult.split("/");
		String nodeToOpen = pathArray[pathArray.length - 1];

		searchTree(nodeToOpen, child);
		String result = searchTree(child, child);

		return result;
	}

	public String searchTree(String node, String child) {
		this.reset();
		for (int i = 0; i < resultRows.size(); i++) {
			if (resultRows.get(i).getText().equals(node)) {
				if (!node.equals(child)) {
					nodes.get(i).click();
					UI.pause(2000);
				} else {
					return child;
				}
			}
		}
		return node;
	}

	public String selectedNode(String nodeLabel) {
		for (int i = 0; i < resultRows.size(); i++) {
			if (resultRows.get(i).getText().equals(nodeLabel)) {
				resultRows.get(i).click();
				return nodeLabel;
			}
		}
		return null;
	}

	public String getRoot() {
		return root.getText();
	}

	public String selectNodeLabel(String nodeLabel) {
		return selectedNode(nodeLabel);
	}

	public String openProperty() {
		UI.pause(2000);
		propertyButton.click();
		String property = "";
		this.reset();
		if (generalProperties.size() > 0) {
			if (generalProperties.get(0).isDisplayed()) {
				property = generalProperties.get(0).getText();
			}
		}
		return property;
	}

	public String closeProperty() {
		UI.pause(2000);
		propertyButton.click();
		String property = null;
		this.reset();
		if (generalProperties.size() > 0) {
			if (generalProperties.get(0).isDisplayed()) {
				propertyButton.click();
			}
		}
		if (generalProperties.size() > 0) {
			property = "";
		}
		return property;
	}

	public Boolean restoreInfoBoxToPage() {
		if (infoPopupContent.isDisplayed()) {
			infoPopupCloseButton.click();
		}
		infoButton.click();
		Boolean isPopupDisplayed = infoPopupContent.isDisplayed();
		return isPopupDisplayed;
	}

	public String verifyIfPropertiesAreDisplayed(String nodeName) {
		selectedNode(nodeName);
		UI.pause(2000);
		return propertyHeaderName.getText();
	}

	public String getRootPosition() {
		this.reset();
		return root.getProperty("transform");
	}

	public void repositionTree() {
		repositionTreeButton.click();
	}

	public void panLeft() {
		UI.pause(500);
		panLeftButton.click();
	}

	public void panRight() {
		UI.pause(500);
		panRightButton.click();
	}

	public Boolean confirmPanDirection(String panDirection, int x) {
		if (panDirection.equals("left")) {
			return getRootXCoordinate() > x;
		} else if (panDirection.equals("right")) {
			return getRootXCoordinate() < x;
		}
		return false;
	}

	private Double getRootXCoordinate() {
		String root = getRootPosition();
		String panCoordinate = root.substring(10, root.length() - 1);
		double xCoordinate = Double.parseDouble(panCoordinate.split(",")[0]);
		return xCoordinate;
	}
}