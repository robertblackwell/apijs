const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const dirs = require('./dirs');
/**
 * This is common webpack config for the sample app, the nrowser test suite and the node testsuite
 * 
 * Provides not entry or output definition, this should be provided by the specialization of the config
 * for each specific use OR be provided as args to the webpack cli command.
 */
const common  = 
{
    entry: [ /*no entry provided - put it on the command line*/],

    stats : {
    	colors: true
    },
	resolve: 
	{
        modules: 
        [
        	path.resolve(dirs.js, "./"), 
        	path.resolve(dirs.js, "controllers"), 
        	path.resolve(dirs.js, "config"), 
        	path.resolve(dirs.js, "models"), 
        	path.resolve(dirs.js, "views"), 
        	path.resolve(dirs.js, "managers"), 
        	path.resolve(dirs.js, "libs"), 
        	path.resolve(dirs.root, "tests"),
			"node_modules",
        ],
		alias: 
		{
			"app" 			: path.resolve(dirs.js, "app"),
			"config" 		: path.resolve(dirs.js, "config"),
			"controllers" 	: path.resolve(dirs.js, "controllers"),
			"managers" 		: path.resolve(dirs.js, "managers"),
			"models" 		: path.resolve(dirs.js, "models"),
			"node_request_manager" : path.resolve(dirs.js, "managers/node_request_manager"),
			"views" 		: path.resolve(dirs.js, "views"),
			"tests" 		: path.resolve(dirs.root, "tests"),
		},
	},
    // output: 
    // {
    //     path: dir_build,
    //     filename: 'bundle.js'
    // },
    module: 
    {
		loaders: 
		[
			{ test: /\.html$/, use: 'html-loader'},
			{ test: /\.css$/, loader: "style-loader!css-loader" },
			{ test: /\.svg/,  loader: 'svg-url-loader'},
			{ test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
			{ test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ }
		]
	},
	devtool : "#source-map",
	plugins:[
	    new webpack.ProvidePlugin({   
	        jQuery: 'jquery',
	        $: 'jquery',
	        jquery: 'jquery'
	    })
	]
}

module.exports = common