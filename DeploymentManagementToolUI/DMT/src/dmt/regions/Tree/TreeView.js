define([
    "jscore/core",
    "text!./Tree.html",
    "styles!./Tree.less"

], function(core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        },

        addSubmitClickHandler: function(fn) {
            this.getElement().find(".eaDMT-wTree").addEventHandler("clickNodeLabel", fn);
        },

        onTreeLoadHandler: function(fn) {
            this.getElement().find(".eaDMT-wTree").addEventHandler("loadTree", fn);
        },

        onTreeZoomHandler: function(fn) {
            this.getElement().find(".eaDMT-wTree").addEventHandler("zoomTree", fn);
        },

        addPanRightClickHandler: function(fn) {
            this.getElement().find(".eaDMT-wPanRight-button").addEventHandler("mousedown", fn);
        },

        addPanLeftClickHandler: function(fn) {
            this.getElement().find(".eaDMT-wPanLeft-button").addEventHandler("mousedown", fn);
        }

    });

});