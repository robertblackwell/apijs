/**
 * Test driver for testing in a browser environment
 *
 * @type       {Function}
 */
const tape = require('tape');
const util = require('util');

const ApiTestSuite = require('./api_suite');
const RpcTestSuite = require('./rpc_suite');
const RestTestSuite = require('./rest_suite');
const JqueryRequestManager = require('managers/jquery_request_manager');

const opts = {
	requestType : "JQUERY_REQUEST",
	// proxy : "http://localhost:8888" //if using Charles NOTE - does nothing for browser tests
	requestConstructor : function(config) {
		return new JqueryRequestManager(config);
	}
}

var t = new ApiTestSuite();
t.run(opts);

var rpcTest = new RpcTestSuite();
rpcTest.run(opts);

var restTest = new RestTestSuite();
restTest.run(opts);
