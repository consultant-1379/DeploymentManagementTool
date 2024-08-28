define([
    "jscore/core",
    "./ButtonItemView"
], function(core, View) {


    /**
     * Initialise and fetches this widget element variables.
     * @returns {{buttonList: HTMLElement, buttonImage: HTMLElement}}
     * @private
     */
    function _initialiseVar() {
        var buttonItem = this.getElement();
        var buttonItemElements = this.getElement().children();
        var buttonListElement = buttonItemElements[1];
        var buttonItemImage = this.getElement().children()[0].children()[0];
        return {buttonList: buttonListElement, buttonImage: buttonItemImage, button:buttonItem};
    }


    /**
     * Configures the button with the expand and collapse image,  adds the click event handler and sets up the expand and
     * collapse CustomEvents for the button.
     * @private
     */
    function _configureButtonItem() {
        this.getElement().find(".eaDMT-wButtonItem-button").addEventHandler("click", function () {
            var __ret = _initialiseVar.call(this);
            var buttonListElement = __ret.buttonList;
            var buttonItemImage = __ret.buttonImage;
            var buttonItem = __ret.button;

            buttonItemImage.removeModifier("state");
            buttonItem.removeModifier("state");

            if (buttonListElement.element.hidden) {
                _setButtonWithExpandImage(buttonItemImage, buttonListElement);
                _setUpExpandCustomEvent.call(this, buttonListElement);
                _setExpandButtonWithUnderline(buttonItem);
            }
            else if (buttonListElement.element.hidden === false) {
                _setButtonWithCollapseImage(buttonItemImage, buttonListElement);
                _setUpCollapseCustomEvent.call(this, buttonListElement);
                _setExpandButtonWithOutUnderline(buttonItem);
            }
        }.bind(this));
    }


    /**
     * Sets the button state, that is if expanded, the property will be expanded, otherwise the state is set to collapse.
     * This widget checks if its id, exist in the session storage.  If it exist, then this widget will be in the expanded
     * state.
     * @private
     */
    function _setButtonsState() {
        var __ret = _initialiseVar.call(this);
        var ButtonItemList = __ret.buttonList;
        var buttonItemImage = __ret.buttonImage;
        var buttonItem = __ret.button;

        if (ButtonItemList.element.hidden && sessionStorage.getItem(ButtonItemList.element.getAttribute("id")) ===
            ButtonItemList.element.getAttribute("id")) {
            _setButtonWithExpandImage(buttonItemImage, ButtonItemList);
            _setExpandButtonWithUnderline(buttonItem);

        }
        else if (ButtonItemList.element.hidden === false) {
            _setButtonWithCollapseImage(buttonItemImage, ButtonItemList);
            _setExpandButtonWithOutUnderline(buttonItem);
        }
    }


    /**
     * Sets the button with the expand image
     * @param buttonItemImage  the expand image for this buttonItem
     * @param buttonItemList   the buttonItem un-ordered list element
     * @private
     */
    function _setButtonWithExpandImage(buttonItemImage, buttonItemList) {
        buttonItemImage.setModifier("state", "expanded");
        buttonItemList.element.hidden = false;

    }


    /**
     * Sets the button with a bottom border for when it is expanded
     * @param buttonItem  the button
     * @private
     */
    function _setExpandButtonWithUnderline(buttonItem) {
        buttonItem.find(".eaDMT-wButtonItem-button").setModifier("state","expanded");
    }


    /**
     * Removes the bottom border when the button has collapsed.
     * @param buttonItem  the button
     * @private
     */
    function _setExpandButtonWithOutUnderline(buttonItem) {
        buttonItem.find(".eaDMT-wButtonItem-button").setModifier("state","collapse");
    }


    /**
     * Sets up the custom event for the Expand button.
     * @param buttonItemList   the buttonItem un-ordered list element
     * @private
     */
    function _setUpExpandCustomEvent(buttonItemList) {
        var event = new CustomEvent("buttonExpanded", {"detail": {"ButtonId": buttonItemList.element.getAttribute("id")}});
        this.getElement().element.dispatchEvent(event);
    }


    /**
     * Sets the button with the collapse image
     * @param buttonItemImage    the collapse button image
     * @param buttonItemList    the buttonItem un-ordered list element
     * @private
     */
    function _setButtonWithCollapseImage(buttonItemImage, buttonItemList) {
        buttonItemImage.setModifier("state", "collapsed");
        buttonItemList.element.hidden = true;
    }


    /**
     * Sets up the custom event for the collapse button.
     * @param ButtonItemList  the element for which the custom event is being set up for
     * @private
     */
    function _setUpCollapseCustomEvent(ButtonItemList) {
        var event = new CustomEvent("buttonCollapse", {"detail": {"ButtonId": ButtonItemList.element.getAttribute("id")}});
        this.getElement().element.dispatchEvent(event);
    }

    return core.Widget.extend({


        View:View,

        onViewReady: function() {
            _configureButtonItem.call(this);

        },


        /**
         *  Sets and configure the button with the content that is to be displayed.
         * @param content  the content name that is to be displayed
         * @param parentId  the parent Id
         */
        setContent: function(content, parentId) {
             this.view.configureItem(content, parentId);
            _setButtonsState.call(this);

        }





    });
});