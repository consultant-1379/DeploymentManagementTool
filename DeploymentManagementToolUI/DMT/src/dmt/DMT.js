define([
    'jscore/core',
    "./DMTView",
    "./widgets/RepositionTree/RepositionTree",
    "./regions/ControlPanel/ControlPanel",
    "./regions/Properties/Properties",
    "./regions/Title/Title",
    "./regions/Navigation/Navigation",
    "./regions/Tree/Tree"

], function (core, View, RepositionTreeWidget, ControlRegion, PropertiesRegion, TitleRegion, NavigationRegion, TreeRegion) {

    return core.App.extend({

        View: View,

        onStart: function () {

            var titleRegion = new TitleRegion({context: this.getContext()});
            titleRegion.start(this.getElement());

            var navigationRegion = new NavigationRegion({context: this.getContext()});
            navigationRegion.start(this.getElement());

            var controlRegion = new ControlRegion({context: this.getContext()});
            controlRegion.start(this.getElement());

            var treeRegion = new TreeRegion({context: this.getContext()});
            treeRegion.start(this.getElement());

            var properties = new PropertiesRegion({context: this.getContext()});
            properties.start(this.getElement());

        }
    });
});