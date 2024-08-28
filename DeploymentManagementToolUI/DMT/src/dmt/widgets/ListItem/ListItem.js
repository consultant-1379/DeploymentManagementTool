define([
    "jscore/core",
    "./ListItemView"
], function(core, View) {
    return core.Widget.extend({
        View: View,

        init: function() {},

        /**
         * Sets the view with the name value pair
         * @param name  the name.
         * @param value  the value
         */
        setContent: function(name, value) {
            this.view.setName(name);
            this.view.setValue(value);
        }
    });
});