define([
    "jscore/core",
    "text!./ButtonItem.html",
    "styles!./ButtonItem.less"
], function(core, template, style) {

    /**
     * Function responsible for setting the element with the ID.
     * @param elementParentId   the id of the parent element
     * @param elementText   the element text..
     * @private
     */
    function _setElementId(elementParentId, elementText) {
        if (elementText === "general_properties") {
            var generalPropertiesClassName = "eaDMT-wButtonItem-buttonList-general_properties";
            this.getElement().find("ul").setAttribute("class", generalPropertiesClassName);
        }
        if (elementParentId) {
            this.getElement().find("ul").setAttribute("id", elementParentId + "_" + elementText);
        }
        else {
            this.getElement().find("ul").setAttribute("id", elementText);
        }
    }

    return core.View.extend({
        getTemplate: function() {
            return template;
        },
        getStyle: function() {
            return style;
        },



        /**
         * Function responsible for configuring the button item
         * @param elementText element text
         * @param elementParentId    Id of the parent element
         */
        configureItem: function (elementText, elementParentId) {
            this.getElement().find("span").setText(elementText);
            _setElementId.call(this, elementParentId, elementText);
        }
    });
});