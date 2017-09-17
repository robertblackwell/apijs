const path = require('path');
/**
 * Provides shortcuts for all the project directories
 *
 */
let dirs = {};

dirs.root 	= path.resolve(__dirname, "../");
dirs.js 	= path.resolve(__dirname, '../js');
dirs.build 	= path.resolve(__dirname, '../dist');
dirs.node_modules = path.resolve(__dirname, "../node_modules")
dirs.tests 	= path.resolve(__dirname, "../tests");
dirs.test_bundles 	= path.resolve(__dirname, "../tests/bundles");
dirs.config = __dirname;
module.exports = dirs;