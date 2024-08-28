var require = ({
    baseUrl: 'src',
	resources: 'resources',
    paths: {
        'jscore': '../node_modules/jscore',
        'widgets': '../node_modules/widgets',
        'text': '../node_modules/jscore/require/text',
        'styles': '../node_modules/jscore/require/styles',
        'template': '../node_modules/jscore/require/template',
		'dmt/config': '../app.config'
    },
	modules: [
		{name: 'dmt/DMT'}
	],
	plugins: ['text', 'styles', 'template']
});
