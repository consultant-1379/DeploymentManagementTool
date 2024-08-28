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

        setTreeWidgetWidthValue: function(width) {
            this.getElement().setStyle("width", width);
        }

    });

});

