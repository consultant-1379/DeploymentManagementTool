(function () {
    var root;

    root = typeof exports !== "undefined" && exports !== null ? exports : this;

    root.container = {
        load: function (appId) {
            appId = appId || 'config';
            var baseUrl=(appId)?'':'src';



            var _this = this;

            return require({
                baseUrl: baseUrl
            }, [appId + '/app.nocache'], (function (config) {

                if(appId==='config'){
                    config.resources='resources';
                    config.paths.jscore='../node_modules/jscore';
                    config.paths.text='../node_modules/jscore/require/text';
                    config.paths.styles='../node_modules/jscore/require/styles';
                    config.paths.template='../node_modules/jscore/template';
                }
                return require({
                    context: appId,
                    baseUrl: 'src',
                    resources: config.resources||config.paths.app + 'resources',
                    paths: config.paths
                }, [config.entryPoint], _this.callback);
            }), this.error);
        },
        callback: function (App) {
            return console.log(App);
        },
        error: function () {
            throw "Can't load application";
        }
    };

}).call(this);
