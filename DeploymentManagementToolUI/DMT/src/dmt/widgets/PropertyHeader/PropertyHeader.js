define([
    'jscore/core',
    "./PropertyHeaderView"
], function (core, View) {

    /**
     * Responsible for setting the Node name and Node status in the Property Header
     * @param nodeProperties node properties
     * @param view  the view where the properties are set with Name and status
     * @private
     */
    var _createPanelHeader = function(nodeProperties, view) {
        view.setNodeName(nodeProperties.id);
        view.setStatus(nodeProperties.status);
    };

    return core.Widget.extend({

        View: View,

        /**
         * Sets the property Header with the Property name and its status
         * @param nodeProperty  node property object containing the name ad the status
         */
        setPropertyHeader: function(nodeProperty){
            _createPanelHeader(nodeProperty,this.view);
        }

    });
});