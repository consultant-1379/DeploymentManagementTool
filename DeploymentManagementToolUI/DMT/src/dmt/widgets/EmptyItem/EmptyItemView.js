define([
    "jscore/core",
    "text!./EmptyItem.html",
    "styles!./EmptyItem.less"
], function(core, template, style) {
    return core.View.extend({
        getTemplate: function() {
            return template;
        },
        getStyle: function() {
            return style;
        },

        /**
         *  Method sets the item with the content name that is to be displayed
         * @param content  the content name that is to be displayed
         */
        configureItem: function (content) {
            this.getElement().find(".eaDMT-wEmptyItem-span").setText(content);
        }
    });
});