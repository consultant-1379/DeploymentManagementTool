define([
    'jscore/ext/mvp',
    "text!./ListItem.html",
    "styles!./ListItem.less",
    "jscore/core"

], function(mvp, template,style, core) {


    return core.View.extend({
        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        },

        /**
         * Sets the name element with the name.
         * @param name the name  to be set.
         */
        setName: function (name) {
            this.getElement().find(".eaDMT-wListItem-name").setText(name);
        },

        /**
         * Sets the value element with the value
         * @param value   the value to be set
         */
        setValue: function (value) {
            this.getElement().find(".eaDMT-wListItem-value").setText(value);
        }
    });
});