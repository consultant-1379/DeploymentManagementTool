define([
    "jscore/core",
    "text!./NavigationBar.html",
    "styles!./NavigationBar.less"
], function(core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        }

    });

});