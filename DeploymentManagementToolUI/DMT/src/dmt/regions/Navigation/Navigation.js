define([
    "jscore/core",
    "./NavigationView",
    "../../widgets/Navigation/NavigationBar",
    "../../widgets/Tree/Tree"
], function(core, View, NavigationWidget, TreeWidget) {

    return core.Region.extend({

        View: View,

        onStart: function() {

            var parent = this.getElement();

            var navigationWidget = new NavigationWidget();
            navigationWidget.attachTo(parent);

            this.getContext().eventBus.subscribe("treeData", function(data) {
                navigationWidget.navBarEvents(data);
            }.bind(this));

            this.view.getNodeProperties(function(e) {
                var value = e.originalEvent.detail.data;
                this.getContext().eventBus.publish("loadNodeProperties", value);
            }.bind(this));

            this.view.openNode(function(e) {
                var value = e.originalEvent.detail.data;
                this.getContext().eventBus.publish("openNode", value);
            }.bind(this));

        }

    });

});