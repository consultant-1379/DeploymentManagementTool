define([
    "jscore/core",
    "text!./Navigation.html",
    "styles!./Navigation.less"

], function(core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        },
        getNodeProperties: function (fn) {
            this.getElement().find(".eaDMT-wNavigation").addEventHandler("getNodeProperties", fn);
        },
        openNode: function (fn) {
            this.getElement().find(".eaDMT-wNavigation").addEventHandler("openNode", fn);
        }
    });
});