define([
    'jscore/core',
    'jscore/ext/net',
    "./TreeView",
    "jscore/base/jquery",
    "../../ext/D3/d3",
    "./../../ext/Tree/DrawTree",
    "./../../ext/Tree/ParseJSONData",
    "./../../ext/Tree/Layout",
    "./../../ext/Tree/TreeUtils",
    "../../ext/Zoom/Zoom"
], function (core, net, View, $, d3, DrawTree,ParseJSONData, Layout, TreeUtils, Zoom) {

    /**
     * Setup Zoom Event on the Tree
     * @private
     */
    var _setupZoomEvent = function() {
        this.zoomScale = {min: 1, max: 1.5};
        //Initialize zoom behaviour from d3
        this.zoom = d3.behavior
            .zoom()
            .x(this.x)
            .y(this.y)
            .scaleExtent([this.zoomScale.min,this.zoomScale.max]);

        //Call the zoom behaviour and attach it to the SVG, setup its' event configuration
        this.svgRoot
            .call(this.zoom.on("zoom", TreeUtils.redraw(this)))
            .on("click.drag", null)
            .on("click.zoom", null)
            .on("dblclick.zoom",null)
            .on("mouseup.drag", TreeUtils.mouseup.call(this));

        this.zoomEvent = Zoom;
    };

    /**
     * binds the root object to a custom event called "loadTree"
     * @private
     */
    var _setupTreeLoadEvent = function(){
        var event = new CustomEvent("loadTree",{"detail":{"data":this.root}});
        this.view.getElement().element.dispatchEvent(event);
    };

    return core.Widget.extend({

        View: View,
        init: function(){
            this.initialWindowWidth = TreeUtils.svgWidth();
        },
        onViewReady: function() {

            this.view.setTreeWidgetWidthValue(this.initialWindowWidth + 5);

            net.ajax({
                url: "/DeploymentManagementService-war/dmtservice/model",
                type: "GET",
                dataType: "json",
                success: function(data) {
                    var parsed_json = ParseJSONData.getParsedLandscape(data.data.children);

                    //Create Tree Container
                    Layout.renderTree.call(this, parsed_json);

                    //Iterates through all of the children and collapses them
                    for(var i in this.root.children){
                        this.collapseAllChildrenNodes(this.root.children[i]);
                    }

                    this.drawTree = DrawTree;
                    this.drawTree.updateTree.call(this, this.root);

                    //Setup Zoom Event Handlers
                    _setupZoomEvent.call(this);

                    //Pass the Root using the EventBus
                    _setupTreeLoadEvent.call(this);

                    //Limits the panning of the Tree
                    TreeUtils.keepTreeInView(this);

                }.bind(this)
            });
        },
        setupMouseEvents: function(){
            var self = this;
            this.treeEvents = {
                nodeFn: function (d) {
                    if (d.depth > 0) {
                        self.expandCollapseChildrenNodes(d);
                        if (d._children !== undefined && d.children !== undefined) {
                            // Highlights the last clicked node circle and makes the open and closed icon white
                            d3.selectAll(".eaDMT-wTree-node-gCircle").classed("eaDMT-wTree-node-gCircle-lastClickedNode", false);
                            d3.select(this).classed("eaDMT-wTree-node-gCircle-lastClickedNode", true);
                        }
                    }

                },
                labelFn: function (d) {
                    if(d.depth !== 0){
                        //Remove highlight from all nodes
                        d3.selectAll("circle").classed("selected", false);

                        //Discover path from child to root
                        TreeUtils.filterPath.call(this, d);
                        TreeUtils.mapPath.call(this, this.ancestors);

                        // creates a URL based on the tree path
                        var pathToRoot = TreeUtils.getJSONPath(this.pathText);
                        this.fullURL = "/DeploymentManagementService-war/dmtservice/properties(" + pathToRoot.join("") + ")";

                        var event = new CustomEvent("clickNodeLabel",{"detail":{"URL":this.fullURL}});
                        this.view.getElement().element.dispatchEvent(event);
                    }
                }.bind(this)
            };
            this.nodeEnterGroup
                .on("click", this.treeEvents.nodeFn);

            this.nodeGroup.selectAll(".eaDMT-wTree-node-textLabel")
                .on("click", this.treeEvents.labelFn);
        },
        expandCollapseChildrenNodes: function(d) {
            //Closes children
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                //Opens Children
                d.children = d._children;
                d._children = null;
            }
            //updates the node plus and minus button
            d3.selectAll(".eaDMT-wTree-node-gCircle-path-linkUnderline2")
                .classed("eaDMT-wTree-node-gCircle-path-linkUnderline2_showing", function (d) {
                    return !d._children;
                });

            this.drawTree.updateTree.call(this, d);
        },
        collapseAllChildrenNodes: function(d){
            d.selected = false;
            if (d.children) {
                //d._Children are hidden, d.Children are visible
                d._children = d.children;

                for(var i in d._children){
                    this.collapseAllChildrenNodes(d._children[i]);
                }

                d.children = null;
            }
            d3.selectAll(".eaDMT-wTree-node-gCircle-path-linkUnderline2")
                .classed("eaDMT-wTree-node-gCircle-path-linkUnderline2_showing", function (d) {
                    return !d._children;
                });
        },
        expandChildrenNodes: function (d){
            //Called by NavigationWidget via the eventBus
            if (!d.children) {
                d.children = d._children;
                d._children = null;
            }
            d3.selectAll(".eaDMT-wTree-node-gCircle-path-linkUnderline2")
                .classed("eaDMT-wTree-node-gCircle-path-linkUnderline2_showing", function (d) {
                    return !d._children;
            });
            this.drawTree.updateTree.call(this, d);
        },
        panRight: function () {
                var x = TreeUtils.getX(this, this.root);
                var y = TreeUtils.getY.call(this, this.root);
                x = x-100;
                this.zoom.translate([x, y]); // resets scales of pan
                this.drawTree.updateTree.call(this, this.root);  //updates everything after translation of tree
        },
        panLeft: function () {
            var x = TreeUtils.getX(this, this.root);
            var y = TreeUtils.getY.call(this, this.root);
            x = x+100;
            this.zoom.translate([x, y]); // resets scales of pan
            this.drawTree.updateTree.call(this, this.root);  //updates everything after translation of tree
        },
        repositionTree: function() {
            this.zoom.scale(1);      //zoom in by scale 1 (lowest zoom= 1 max zoom = 3
            var treeViewHeight = this.size.height;
            if(treeViewHeight <= 600){
                this.zoom.translate([0, treeViewHeight/2 - this.root.x]); // resets scales of pan
            } else {
                this.zoom.translate([0, treeViewHeight/2 - this.root.x - 40]); // resets scales of pan
            }
            this.zoomLevel = this.zoom.scale();

            //Event Triggers Zoom Slider Update on the ZoomWidget
            var event = new CustomEvent("zoomTree", {detail:{data:this}});
            this.view.getElement().element.dispatchEvent(event);

            this.drawTree.updateTree.call(this, this.root);
        },
        zoomIn: function() {
            this.zoomEvent.zoomIn.call(this);
        },
        zoomOut: function() {
            this.zoomEvent.zoomOut.call(this);
        },
        zoomSlider: function(value) {
            this.zoomEvent.zoomSlider.call(this, value);
        }
    });
});