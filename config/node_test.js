const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const dirs = require('./dirs.js');
/**
 * Customization for testing in a node environment. Dont bundle in node modules
 *
 * @type       {Function}
 */
let common = require('./common.js');
common.entry = [];
const mods = {
	/**
	* entry and output should be defined in the build script on the command line
	*/
	externals: [nodeExternals()],    
	target: 'node',
}
const config = merge(common, mods);

module.exports = config;

