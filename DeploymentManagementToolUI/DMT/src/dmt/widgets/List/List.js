define([
    "jscore/core",
    "jscore/ext/utils/base/underscore",
    "./ListView",
    "../ListItem/ListItem",
    "../ButtonItem/ButtonItem",
    "../EmptyItem/EmptyItem",
    "../../ext/D3/d3"


], function(core, _, View, ListItem, ButtonItem, EmptyItem, d3) {

    /**
     * This method extracts properties that are undefined, "", string, int, boolean and null and place them in
     * a holding object.  These properties will be displayed under general properties.  These are also removed from
     * node properties. Node properties now only contain a list of objects.
     *
     * @param nodeProperties  a list of properties where non objects and non arrays are being extracted from.
     * @returns {{}}    An object that contains a list properties that are to be displayed under general properties
     * @private
     */
    var _createGeneralPropertiesObject = function(nodeProperties) {
        //excluding id and status as it is being displayed in the property header widget
        delete nodeProperties.id;
        delete nodeProperties.status;
        var holdingObject = {general_properties: {}};
        for (var index in nodeProperties) {
            if (typeof nodeProperties[index] === 'undefined' || nodeProperties[index] === "" || typeof nodeProperties[index] in {'string':1,'boolean':1} || _isInt(nodeProperties[index]) || nodeProperties[index] === null) {
                 holdingObject.general_properties[index] = nodeProperties[index];
                delete nodeProperties[index];
            }
        }
        return holdingObject;
    };


    /**
     * This function evaluates whether the value passed is an integer
     * @param value  the value
     * @returns {boolean}  true if a number, false otherwise
     * @private
     */
    function _isInt(value) {
        return typeof value === 'number' && value % 1 === 0;
    }

    /**
     ** Method responsible for loading up property headings and its children.
     *
     * @param nodeProperties  A list of property objects that are to be displayed.
     * @param parentElement   is the parent property element to which children items if any will be attached too.
     * @param parentId    is the id of a parent property which contains sub properties (or child objects)
     * @param baseList   is the base list (which is this widget) to which the property items are attached too.
     * @private
     */
    var _fetchProperties = function(nodeProperties, parentElement, parentId, baseList) {
        for (var index in nodeProperties) {
            if (typeof nodeProperties[index] === "object" && nodeProperties[index] !== null) {
                _loadMainPropertyHeadings(nodeProperties, index, parentId, parentElement, baseList);
            }
            else {
                _loadChildrenForMainPropertyHeadings(index, nodeProperties, parentElement, baseList);
            }
        }
    };

    /**
     * Method loads the Main property headings that is to be displayed in this widget
     * @param nodeProperties   A list of property objects that are to be displayed.
     * @param index            the nodeProperties index that is to be displayed
     * @param parentId         is the id of a parent property which contains sub properties (or child objects)
     * @param parentElement    is the parent property element to which child items if any will be attached too.
     * @param baseList         is the base list (which is this widget) to which the property items are attached too.
     * @private
     */
    function _loadMainPropertyHeadings(nodeProperties, index, parentId, parentElement, baseList) {
        if (_.isEmpty(nodeProperties[index])) {
            var emptyItem = new EmptyItem();
            emptyItem.setContent(index);
            if(parentElement) {
                emptyItem.attachTo(parentElement);
            }else{
                emptyItem.attachTo(baseList);
            }
        }
        else {
            var buttonItem = new ButtonItem();

            buttonItem.setContent(index, parentId);
            if(parentElement) {
                buttonItem.attachTo(parentElement);
            }  else{
                buttonItem.attachTo(baseList);
            }
            _fetchProperties(nodeProperties[index], buttonItem.element.find("ul"), index);
        }
    }

    /**
     * Method loads children property items if any that is to be displayed on this widget under its parent property
     * heading.
     *
     * @param index             the nodeProperties index that is to be displayed.
     * @param nodeProperties    A list of property objects that are to be displayed.
     * @param parentElement     is the parent property element to which child items if any will be attached too.
     * @param baseList          is the base list (which is this widget) to which the property items are attached too.
     * @private
     */
    function _loadChildrenForMainPropertyHeadings(index, nodeProperties, parentElement, baseList) {
        var listItem = new ListItem();
        //scenario where a property value could be an empty string..
        if(nodeProperties[index]===""){
            listItem.setContent(index, "\" \"");
            //testing for a undefined scenario...
        }else if(nodeProperties[index]==='undefined'){
            listItem.setContent(index, "undefined");
        }else{
            listItem.setContent(index, nodeProperties[index]);
        }

        if(parentElement) {
            listItem.attachTo(parentElement);
        }  else{
            listItem.attachTo(baseList);
        }
    }


    return core.Widget.extend({

        View:View,

        /**
         *  Loads and Sets the property panel with the properties
         * @param nodeProperties node property object containing the properties..
         */
        setPropertyPanel: function(nodeProperties){
            var generalPropertiesObject =_createGeneralPropertiesObject(nodeProperties);

            _fetchProperties(generalPropertiesObject, this.getElement());

            _fetchProperties(nodeProperties, this.getElement());
        }
    });


});