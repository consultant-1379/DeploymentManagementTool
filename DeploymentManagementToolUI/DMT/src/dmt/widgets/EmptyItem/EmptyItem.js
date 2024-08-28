define([
    "jscore/core",
    "./EmptyItemView"
], function(core, View) {
    return core.Widget.extend({

        View:View,

        /**
         * Sets the widget with the content name that is to be displayed
         * @param content   the content name that is to be displayed
         */
        setContent: function(content) {
            this.view.configureItem(content);
        }
    });
});