/**
 * test driver for testing in a node environment
 *
 * @type       {Function}
 */
const tape = require('tape');
const util = require('util');

const ApiTestSuite = require('./api_suite');
const RpcTestSuite = require('./rpc_suite');
const RestTestSuite = require('./rest_suite');
const NodeRequestManager = require('managers/node_request_manager');
const opts = {
	requestType : "NODE_REQUEST",
	requestConstructor : function(config) {

		return new NodeRequestManager(config);
	},
	// proxy : "http://localhost:8888" //uncomment if you want to use Charles to view http traffic
}

var t = new ApiTestSuite();
t.run(opts);

var rpcTest = new RpcTestSuite();
rpcTest.run(opts);

var restTest = new RestTestSuite();
restTest.run(opts);
