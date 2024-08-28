define([
    "jscore/core",
    "./TreeView",
    "../../widgets/Tree/Tree",
    "../../widgets/Legend/Legend",
    "../../widgets/PanLeft/PanLeft",
    "../../widgets/PanRight/PanRight"

], function(core, View, TreeWidget, LegendWidget, PanLeftWidget, PanRightWidget) {

    return core.Region.extend({

        View: View,

        onStart: function() {

            var parent = this.getElement();

            var treeWidget = new TreeWidget();
            treeWidget.attachTo(parent);

            var legendWidget = new LegendWidget();
            legendWidget.attachTo(parent);

            var panLeftWidget = new PanLeftWidget();
            panLeftWidget.attachTo(parent);

            var panRightWidget = new PanRightWidget();
            panRightWidget.attachTo(parent);

            this.view.addSubmitClickHandler(function(e) {
                var URL = e.originalEvent.detail.URL;
                this.getContext().eventBus.publish("transferURL", URL);
            }.bind(this));

            this.view.onTreeLoadHandler(function(e) {
                var value = e.originalEvent.detail.data;
                this.getContext().eventBus.publish("treeData", value);
            }.bind(this));

            this.view.onTreeZoomHandler(function(e) {
                var value = e.originalEvent.detail.data;
                this.getContext().eventBus.publish("treeZoom", value);
            }.bind(this));

            this.view.addPanRightClickHandler(function() {
                treeWidget.panRight();
            }.bind(this));

            this.view.addPanLeftClickHandler(function() {
                treeWidget.panLeft();
            }.bind(this));

            /**
             * Event Subscriptions
             */
            this.getContext().eventBus.subscribe("loadNodeProperties", function(node) {
                treeWidget.treeEvents.labelFn(node);
            }.bind(this));

            this.getContext().eventBus.subscribe("openNode", function(node) {
                treeWidget.expandChildrenNodes(node);
            }.bind(this));

            this.getContext().eventBus.subscribe("repositionTree", function() {
                treeWidget.repositionTree();
            }.bind(this));

            this.getContext().eventBus.subscribe("treeZoomIn", function() {
                treeWidget.zoomIn();
            }.bind(this));

            this.getContext().eventBus.subscribe("treeZoomOut", function() {
                treeWidget.zoomOut();
            }.bind(this));

            this.getContext().eventBus.subscribe("treeZoomSlider", function(value) {
                treeWidget.zoomSlider(value);
            });
        }
    });
});