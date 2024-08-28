define([
    'jscore/core',
    "./NavigationBarView",
    "jscore/ext/utils/base/underscore",
    "jscore/base/jquery"
], function (core, View, _, $) {

    /**
     *
     * @type {{}}
     * @private
     */
    var _root = {};

    /**
     * Gets children for the node
     * @param parentNode
     * @return parentNode children regardless is they are visible on the tree view
     * @private
     */
    var _getChildren = function (parentNode){
        return parentNode.children ? parentNode.children : parentNode._children;
    };

    /**
     * Removes node children from their objects and creates an array of children names
     * @param parentNode
     * @return an array of children names
     * @private
     */
    var _mapChildrenResults = function (parentNode){
        var children = _getChildren(parentNode);
        return _.map(children, function (index){ return index.name; });
    };

    /**
     * Builds an array from the path on the Navigation Bar, whilst creating a
     * new array with each child object so that it can be passed on to the Tree
     * Widget.
     * @param parentNode
     * @param node
     * @param lastNode
     * @param searchResponse
     * @return searchResponse object
     * @private
     */
    var _findNodeChildren = function (parentNode, node, lastNode, searchResponse){
        for (var i = 0; i < node.length; i++) {
            var node_children = "";
            if (parentNode.name == node[0] && parentNode.name == lastNode) {

                searchResponse.children = _mapChildrenResults(parentNode);

                if (parentNode.name == "/") {
                    searchResponse.pathChildren.push(parentNode);
                    searchResponse.finalPath = "/";
                }
            }
            else {
                node_children = _getChildren(parentNode);
                node.shift();
                var nextPath = node[i];

                for (var j = 0; j < node_children.length; j++) {

                    var currentNode = node_children[j];

                    if (nextPath == currentNode.name) {
                        searchResponse.pathChildren.push(currentNode);
                        searchResponse.finalPath += currentNode.name + "/";
                        _findNodeChildren(currentNode, node, lastNode, searchResponse);
                    }
                }
            }
        }
        return searchResponse;
    };

    /**
     * Search the path entered in the Navigation Bar for children
     * and return back an object containing an array of child objects,
     * the finalPath entered, the actual path entered in the navBar
     * @param path
     * @param root
     * @return searchResponse
     * @private
     */
    var _searchNodePath = function (path, root){
        var node = path.split('/');
        node[0]="/";
        node.pop();
        var lastNode = node[node.length-1];

        var searchResponse = {
            path:path,
            children:[],
            finalPath: "/",
            pathChildren:[]
        };

        return _findNodeChildren(root, node, lastNode, searchResponse);
    };

    /**
     * Keyboard shortcut codes
     * @type {{ENTER: number, UP: number, DOWN: number, TAB: number, ESCAPE: number}}
     * @private
     */
    var _keys = {
        ENTER: 13,
        UP: 38,
        DOWN: 40,
        TAB: 9,
        ESCAPE: 27
    };

    /**
     * Scroll through result pane using keyboard keys, UP, DOWN and TAB
     * @param b = currentlySelected index of the results list
     * @param navBar
     * @private
     */
    var _adjustScroll = function (b, navBar) {
        var a, c, d;
        if(b !== -1){
            try{
                a = $(".eaDMT-wNavigation-resultsPane li:visible").get(b).offsetTop;
                c = $(navBar.dropDownList).scrollTop();
                d = c + 300 - 23;
                (a < c) ? $(navBar.dropDownList).scrollTop(a) : a > d && $(navBar.dropDownList).scrollTop(a - 300 + 23);
            }catch(e){

            }
        }
    };

    /**
     * Filter out list items in the resultPane based on the path entered on the navBar
     * @param path
     * @param navBar
     * @private
     */
    var _filterList = function (path, navBar){
        //Hide ListItems and ResultsPane
        $(".eaDMT-wNavigation-resultsPane>li").hide().addClass('hidden');
        $(navBar.dropDownList).hide();

        //Custom JQuery Expression - filter ListItem based on text input
        $.expr[":"].icontains = $.expr.createPseudo(function (arg) {
            return function (elem) {
                return ($(elem).text()).toLowerCase().indexOf(arg.toLowerCase()) >= 0;
            };
        });

        $(".eaDMT-wNavigation-resultsPane>li:icontains('" + path + "')")
            .show()
            .removeClass('hidden')
            .on('mouseover', function() {
                $(".eaDMT-wNavigation-resultsPane>li").removeClass("eaDMT-wNavigation-resultsPane-listItem_selected");
                $(this).addClass("eaDMT-wNavigation-resultsPane-listItem_selected");
            })
            .on('click', function(){
                //Updates results dropDown, does not exectue getting properties for path
                navBar.path.value= $(this).text()+"/";
                navBar.pathText =  $(this).text()+"/";
                _getList(navBar, _root);
                _filterList($(this).val(), navBar);
                navBar.path.blur();
            });

        //Show resultsPane if there are non hidden ListItems
        if($(".eaDMT-wNavigation-resultsPane>li:not('.hidden')").length > 0){
            $(navBar.dropDownList).show();
        }
    };

    /**
     * Displays the children in a list under the Navigation Bar in the resultPane.
     * If the path enter does not match existing children then the resultPane is hidden from view.
     * @param navBar
     * @param root
     * @private
     */
    var _getList = function(navBar, root){
        //Retrieves reults for path entered in Nav Bar
        navBar.result = _searchNodePath(navBar.path.value, root);
        if(navBar.result.children.length !== 0 && navBar.result.path == navBar.pathText){

            navBar.lastPath = navBar.result.finalPath;

            //Clear List
            $(navBar.dropDownList).empty();

            //Add List Items
            navBar.result.children.forEach(function(i){
                var child = $('<li class="eaDMT-wNavigation-resultsPane-listItem">'+navBar.lastPath+i+'</li>');
                $(navBar.dropDownList).append(child);
            });

            //Show List
            $(navBar.dropDownList).show();
        }else {
            //Hide results dropDown if there's none to show.
            $(navBar.dropDownList).hide();
        }
    };

    /**
     * Opens the nodes on the tree view and selects the last node's properties,
     * Uses the event bus to communicate to the TreeWidget by creating two event types
     * 1.getNodeProperties
     * 2.openNode
     * @param navBar
     * @private
     */
    var _openTreePath = function(navBar){
        //Opens the nodes on the tree view based on the path
        var pathChildren = navBar.result.pathChildren;
        var lastChildIndex = pathChildren.length-1;
        for(var i=0; i<pathChildren.length; i++){
            if(i == lastChildIndex){
                //Get properties fot this node
                var node = pathChildren[i];
                var event = new CustomEvent("getNodeProperties", {detail:{data:node}});
                navBar.view.dispatchEvent(event);
            }
            else{
                //open these nodes on the tree view
                function openNode(node) {
                    var event = new CustomEvent("openNode", {detail:{data:node}});
                    navBar.view.dispatchEvent(event);
                }
                openNode(pathChildren[i]);
            }
        }
    };


    return core.Widget.extend({

        View: View,

        onViewReady: function (){

            var input = this.getElement().find("input").element,
                button = this.getElement().find("button").element,
                resultPane = this.getElement().find("ul").element;

            //Setup Navigation Bar object
            this.navBar = {
                view: this.getElement().element,
                path: input,
                dropDownList:  resultPane,
                dropDownListItems: $('.eaDMT-wNavigation-resultsPane>li'),
                openTreeBtn: button,
                selectedIndex: -1,
                lastPath: "",
                result: {
                    path:"",
                    children:[],
                    finalPath: "/",
                    pathChildren:[]
                }
            };
        },
        /**
         * Event Bus for Keyboard and Mouse, called when Tree has loaded
         * @param root
         */
        navBarEvents: function(root){
            var navBar = this.navBar;
            _root = root;
            $(this.navBar.path)
                .on('keydown', function (e) {
                    var currentSelectedListEl = "";
                    var $visibleItems = $(".eaDMT-wNavigation-resultsPane>li:not('.hidden')");
                    var selected = $visibleItems.filter('.eaDMT-wNavigation-resultsPane-listItem_selected');

                    switch (e.keyCode){
                        case _keys.ENTER:{
                            /*Exceute Tree Function, open node path and display properties.
                             * Can be executed as shown above via "return key" or
                             * a button placed after the path*/
                            _openTreePath(navBar);
                            _filterList(navBar.path.value, navBar);
                            navBar.path.blur();
                            break;
                        }
                        case _keys.TAB:
                        case _keys.DOWN:{
                            e.preventDefault();
                            if($(".eaDMT-wNavigation-resultsPane>li").is(':visible')){
                                if(selected.length > 0){
                                    $visibleItems.removeClass('eaDMT-wNavigation-resultsPane-listItem_selected');
                                    if (selected.next().length == 0) {
                                        currentSelectedListEl = navBar.lastPathValue;
                                        navBar.selectedIndex = -1;
                                    } else {
                                        var currentIndex = navBar.selectedIndex;
                                        for(var i=0; i<$visibleItems.length; i++){
                                            if(selected.text() == $visibleItems[i].textContent){
                                                currentIndex = i;
                                                break;
                                            }
                                        }
                                        currentSelectedListEl =  $visibleItems.slice(currentIndex+1).first().addClass("eaDMT-wNavigation-resultsPane-listItem_selected").text();
                                        navBar.selectedIndex = $(".eaDMT-wNavigation-resultsPane .eaDMT-wNavigation-resultsPane-listItem_selected").index();
                                    }
                                    if(currentSelectedListEl == ""){
                                        currentSelectedListEl = navBar.lastPathValue;
                                        navBar.selectedIndex = -1;
                                    }
                                }
                                else{
                                    currentSelectedListEl = $visibleItems.first().addClass("eaDMT-wNavigation-resultsPane-listItem_selected").text();
                                    navBar.selectedIndex = $(".eaDMT-wNavigation-resultsPane .eaDMT-wNavigation-resultsPane-listItem_selected").index();
                                }
                                navBar.path.value= currentSelectedListEl;
                                navBar.pathText =  currentSelectedListEl+"/";
                                navBar.result = _searchNodePath(navBar.pathText, _root);
                                _adjustScroll(navBar.selectedIndex, navBar);
                            }
                            break;
                        }
                        case _keys.UP:{
                            e.preventDefault();
                            if($(".eaDMT-wNavigation-resultsPane>li").is(':visible')){
                                if(selected.length > 0){
                                    $visibleItems.removeClass('eaDMT-wNavigation-resultsPane-listItem_selected');
                                    if (selected.prev().length == 0) {
                                        currentSelectedListEl = navBar.lastPathValue;
                                        navBar.selectedIndex = -1;
                                    } else {
                                        var currentIndex = navBar.selectedIndex;
                                        for(var i=0; i<$visibleItems.length; i++){
                                            if(selected.text() == $visibleItems[i].textContent){
                                                currentIndex = i;
                                                break;
                                            }
                                        }
                                        currentSelectedListEl = $visibleItems.slice(0, currentIndex).last().addClass("eaDMT-wNavigation-resultsPane-listItem_selected").text();
                                        navBar.selectedIndex = $(".eaDMT-wNavigation-resultsPane .eaDMT-wNavigation-resultsPane-listItem_selected").index();
                                    }
                                    if(currentSelectedListEl == ""){
                                        currentSelectedListEl = navBar.lastPathValue;
                                        navBar.selectedIndex = -1;
                                    }
                                }
                                else{
                                    currentSelectedListEl = $visibleItems.last().addClass("eaDMT-wNavigation-resultsPane-listItem_selected").text();
                                    navBar.selectedIndex = $(".eaDMT-wNavigation-resultsPane .eaDMT-wNavigation-resultsPane-listItem_selected").index();
                                }
                                navBar.path.value= currentSelectedListEl;
                                navBar.pathText =  currentSelectedListEl+"/";
                                navBar.result = _searchNodePath(navBar.pathText, _root);
                                _adjustScroll(navBar.selectedIndex, navBar);
                            }
                            break;
                        }
                        case _keys.ESCAPE:{
                            navBar.path.blur();
                        }
                    }
                })
                .on('input', function () {
                    navBar.pathText = this.value;
                    navBar.lastPathValue = this.value;
                    _getList(navBar, _root);
                    _filterList(this.value, navBar);
                })
                .on('focus', function (){
                    if(this.value !== ""){
                        navBar.pathText = this.value;
                        navBar.lastPathValue = this.value;
                        _getList(navBar, _root);
                        _filterList(this.value, navBar);
                    }
                })
                .on('blur', function (){
                   setTimeout(function(){
                        $('.eaDMT-wNavigation-resultsPane').hide();
                    },250);
                });

            $(this.navBar.openTreeBtn)
                .on('click', function(){
                    _openTreePath(navBar);
                });

            $(this.navBar.dropDownList)
                .on('mousedown',function(e){
                    e.preventDefault();
                });
        }
    });

});