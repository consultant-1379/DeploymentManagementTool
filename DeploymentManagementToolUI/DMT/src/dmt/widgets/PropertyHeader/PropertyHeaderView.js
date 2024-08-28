define([
    "jscore/core",
    "text!./PropertyHeader.html",
    "styles!./PropertyHeader.less"
], function(core, template, style) {

    var nodePropertyObject;

    return core.View.extend({


        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        },

        setNodeName: function(nodeName) {
            this.getElement().find(".eaDMT-wPropertyHeader-nodeName").setText(nodeName);
        },

        setStatus: function(status) {
            this.getElement().find(".eaDMT-wPropertyHeader-statusValue").setText(status);
        }
    });

});
