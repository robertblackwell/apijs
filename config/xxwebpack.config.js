const path = require('path')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const dirs = require('./dirs.js');
const merge = require('webpack-merge');

const Configuration = require('../js/app/configuration');

var common = require('./common.js');
common.entry = [];
var local = {
	node: {fs: 'empty'},
	resolve :{
		alias:{
			node_request_manager : path.resolve(dirs.js, 'managers/node_request_manager_empty'),
			active_config : path.resolve(__dirname, "local.config")
		}
	}
}

var config = merge(common, local);

module.exports = config;
