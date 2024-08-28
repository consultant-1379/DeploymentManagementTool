define([
    "jscore/core",
    "./PropertiesView",
    "jscore/ext/net",
    "../../widgets/List/List",
    "../../widgets/PropertyHeader/PropertyHeader"

], function(core, View, net, ListWidget,PropertyHeaderWidget) {

    var _propertyHeader;

    var _list;

    /**
     * Destroys the previously created widgets
     * @private
     */
    function _destroyWidgets() {
        if (_propertyHeader) {
            _propertyHeader.destroy();
        }
        if (_list) {
            _list.destroy();
        }
    }

    /**
     * Creates new widgets to display the properties
     * @private
     */
    function _createWidgets() {
        _propertyHeader = new PropertyHeaderWidget();
        _propertyHeader.attachTo(this.getElement());
        _list = new ListWidget();
        _list.attachTo(this.getElement());
    }

    /**
     * Sets the widgets with the properties
     * @param nodeProperties  the retrieved properties used to set the property widgets
     * @private
     */
    function _setRetrievedProperties(nodeProperties) {
        _propertyHeader.setPropertyHeader(nodeProperties);
        _list.setPropertyPanel(nodeProperties);
    }

    /**
     * Gets the properties for the selected node.
     * @param url   the url from where the properties are to be fetched from
     * @private
     */
    var _getSelectedNodeProperties  = function(url) {
        var nodePropertiesURL = url;
        net.ajax({
            url: nodePropertiesURL,
            type: "GET",
            dataType: "json",
            success: function (nodeProperties) {
                _destroyWidgets();
                _createWidgets.call(this);
                _setRetrievedProperties(nodeProperties);
                _addClickHandler.call(this);
                _addCollapseHandler.call(this);
            }.bind(this)

        });
    } ;

    /**
     * Adds the clickHandler to the property widget for the button click event. The buttonItem id is added to
     * session storage so that the property can be fetched by the buttonItem widget to determine whether the button
     * should be expanded. If the buttonItem id exist, then the button item should be expanded.
     * @private
     */
    function _addClickHandler() {
        this.view.addExpandHandler(function (e) {
            var buttonID = e.originalEvent.detail.ButtonId;
            sessionStorage.setItem(buttonID,buttonID);
        }.bind(this));
    }


    /**
     * Adds the clickHandler to the property widget for the button click event.  The buttonItem id is removed from the
     * session storage. The buttonItem id no longer exist, so the buttonItem widget will be in a collapse state
     * @private
     */
    function _addCollapseHandler() {
        this.view.addCollapseHandler(function (e) {
            var buttonID = e.originalEvent.detail.ButtonId;
            sessionStorage.removeItem(buttonID,buttonID);
        }.bind(this));
    }

    return core.Region.extend({

        View: View,

        onStart: function () {

            var parent  = this.view.getElement(),
                info = core.Element.parse('<div class="eaDMT-nodeInfo">' +
                '<i style="position:absolute;" class="ebIcon ebIcon_large ebIcon_dialogInfo"></i>' +
                '<span style=" display: inline-block; font-size: 2rem; color:#333333; padding: 0px 0px 5px 40px; line-height: 26px;">You have no<br> element selected</span>' +
                '<hr style="height: 1px; border: none; background-color: #8a8a8a;">' +
                '<p style="font-size: 1.4rem; color: #8a8a8a; padding:  0px 0px 10px 40px;">Click on a node label to<br> display its properties here.</p>' +
                '</div>');

            parent.append(info);

            this.getContext().eventBus.subscribe("transferURL", function(data) {
                if (info.element.parentNode) {
                    info.element.parentNode.removeChild(info.element);
                }
                this.setPanelWithProperties(data);
            }.bind(this));
        },

        /**
         * Sets up the Property Panel using the URL to retrieve the properties that are to be displayed.
         * @param url     the url where the properties are to be fetched from.
         */
        setPanelWithProperties: function(url){
          _getSelectedNodeProperties.call(this, url);
        }

    });
});