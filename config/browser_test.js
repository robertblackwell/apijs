const path = require('path')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const dirs = require('./dirs.js');
const merge = require('webpack-merge');

/**
 * Browser testing customizations.
 * provide two dummy modules (for "fs" and "node_request_manager") so that we dont get 
 * webpack errors due to including code that is only
 * executed in a node environment.
 */
let common = require('./common.js');
common.entry = [];
const local = {
	node: {
		fs: 'empty',
	 	// 'net' : 'empty',
	 	// 'tls' : 'empty', 
	 	// 'url' : 'empty'
	 },
	resolve :{
		alias:{
			//node_request_manager : path.resolve(dirs.js, 'managers/node_request_manager_empty'),
		}
	},

}
const config = merge(common, local);

module.exports = config;
