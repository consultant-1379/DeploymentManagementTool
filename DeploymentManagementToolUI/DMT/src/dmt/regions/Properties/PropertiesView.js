define([
    "jscore/core",
    "text!./Properties.html",
    "styles!./Properties.less"
], function(core, template, style) {


    /**
     * This method sets up the handler for buttonItem widgets only
     * @param parent  parent widget that may or may not contain buttonItem widget
     * @param handlertype   The type of handler to set, it can either be buttonExpanded  or buttonCollapse
     * @param fn           the function that is to be applied by the handler
     * @private
     */
    function _addHandler(parent, handlertype, fn) {
        parent.children().forEach(function (widgetType) {
            if (widgetType.getAttribute("class") === "eaDMT-wButtonItem") {
                widgetType.addEventHandler(handlertype, fn);

            }
            if(widgetType.children().length>0){
                _addHandler(widgetType,handlertype, fn);
            }
        }.bind(this));
    }

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        },

        /**
         * Adds the expand event handler to the buttonItem
         * @param fn  the function that is to be used by the handler for this event
         */
        addExpandHandler: function(fn) {
            var parent =  this.getElement().find(".eaDMT-wList");
            var handlerType = "buttonExpanded";
            _addHandler.call(this, parent, handlerType,  fn);
        },

        /**
         *  Adds the collapse event handler to the buttonItem widget
         * @param fn the function that is to be used by the handler for this event
         */
        addCollapseHandler: function(fn) {
            var parent =  this.getElement().find(".eaDMT-wList");
            var handlerType = "buttonCollapse";
            _addHandler.call(this, parent, handlerType,  fn);
        }

    });
});