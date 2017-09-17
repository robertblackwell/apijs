/**
 * Test suite for API - runs through a set of api calls using the following combination
 * of options
 * 
 * 	-	REST sending JSON bodies in requests, asscesToken in header
 * 	-	RPC sending JSON bodies in requests, asscesToken in header
 * 	-	RPC do not sending JSON bodies in requests, send "form" encoding, assessToken in header
 * 	-	RPC do not sending JSON bodies in requests, send "form" encoding, assessToken body not in header
 *
 */
const tape = require('tape');
const util = require('util');

const ApiManagerFactory = require('../js/managers/api_manager_factory');
const RpcManager = require('../js/managers/rpc_manager');
const RestManager = require('../js/managers/rest_manager');
const Configuration = require('../js/configuration');

function ApiTestSuiteOneCombination(label, config)
{
	this.config = config;
	this.label = label;
	this.api = ApiManagerFactory(config);
}
ApiTestSuiteOneCombination.prototype.run = function run()
{
	this.testCreateApi();
	this.testApiEcho();
	this.testApiLogin();
	this.testApiNotSecret();
	this.loginAndUserAdminSecret();
}
/**
 * Tests that we construct the correct api manager instance.
 * Note there is a bit of trickery going on behind the scenes here.
 * The clue is th euse of the getMyId() call -- cannot check
 * prototype chains or constructor names as we are using object
 * extension to create these managers
 */
ApiTestSuiteOneCombination.prototype.testCreateApi = function testCreateApi()
{
	const apiIds = {
		"RPC" : "RpcManager",
		"REST" : "RestManager",
	}
	const config = this.config;
	const apiType = this.config.apiType;
	const apiName = apiIds[apiType];
	tape.test("test new ApiManager", function (childTest)
	{
		var api = ApiManagerFactory(config);
		console.log("XXXXX");
		console.log(api);
		childTest.equal(api.getMyId(), apiName);
		childTest.end();
	});

}
ApiTestSuiteOneCombination.prototype.testApiEcho = function testRpcApiEcho()
{
	const api = this.api;
	/**
	 * show that rpc requests can also send nested objects
	 */
	tape.test(this.label+":"+"apiEcho", function(childTest)
	{
			// dev.echo(one, two) 
		const params = {
			one : 111, // note its a number
			two : {
				b1 : "111", //note it is a string
				b2 : "222"
			}
		}
		return api.echo(params)
		.then((response)=>
		{
			console.log(["networkManager-rpcApiEcho then", response.result]);
			childTest.equal(typeof response, 'object', "response is object");
			childTest.equal(response.error, null, "error is null" );
			/**
			 * dev.echo one ---> a  two ---> b - changes parameter names on the returned object
			 */
			childTest.equal(typeof response.result.a, 'number', 'type of response.result.a is number');
			childTest.equal(response.result.a, 111, "one should be 111");
			childTest.equal(typeof response.result.b.b1, 'string', "response contains b property");
			childTest.equal(response.result.b.b1, '111', "b.b1 should be '111'");
			childTest.end();
		})
		.catch((err)=>
		{
			console.log(err);
			childTest.ok(false, "failed - got an error");
			childTest.end();
		});

	});
}
ApiTestSuiteOneCombination.prototype.testApiNotSecret = function testRpcApiNotSecret()
{
	const api = this.api;
	tape.test(this.label+":notSecret", function(childTest)
	{
		api.notSecret({})
		.then((response)=>
		{
			childTest.equal(typeof response, 'object', "r is object");
			childTest.equal(response.error, null, "error is null" )
			childTest.end();
		})
		.catch((err) =>
		{
			childTest.ok(false, "failed - got an error");
			childTest.end();
		});
	});
}
ApiTestSuiteOneCombination.prototype.testApiLogin = function testRpcApiLogin()
{
	const api = this.api;
	tape.test(this.label+":login", function(childTest)
	{
		api.login("robertblackwell", "password")
		.then((response)=>
		{
			console.log(response);
			childTest.equal(typeof response, 'object', "response is object");
			childTest.equal(response.error, null, "error is null" );
			childTest.equal(typeof response.result.token, 'string')
			childTest.equal(typeof response.result.username, 'string')
			childTest.end();
		})
		.catch((err) =>
		{
			console.log(err);
			childTest.ok(false, "failed - got an error");
			childTest.fail();
			childTest.end();
		});
	})
};
ApiTestSuiteOneCombination.prototype.loginAndUserAdminSecret = function loginAndUserAdminSecret()
{
	const api = this.api;
	tape.test(this.label+":loginUserAdminSecret", function(childTest)
	{
		api.login("robertblackwell", "password")
		.then((response)=>
		{
			var token = response.result.token;
			return api.userSecret();
		})
		.then( (response) =>
		{
			// console.log(response);
			childTest.equal(typeof response, 'object', "response is object");
			childTest.equal(response.error, null, "error is null" );
			childTest.equal(typeof response.result.tag, 'string');
			childTest.equal(typeof response.result.code, 'string');
			var re = /^USER/;
			childTest.notEqual(typeof response.result.message.match(re), null);
			return api.adminSecret();
		})
		.then( (response) =>
		{
			// console.log(response);
			childTest.equal(typeof response, 'object', "response is object");
			childTest.equal(response.error, null, "error is null" );
			childTest.equal(typeof response.result.tag, 'string')
			childTest.equal(typeof response.result.code, 'string')
			var re = /^ADMIN/;
			childTest.notEqual(typeof response.result.message.match(re), null);
			childTest.end();
		})
		.catch( (err) =>
		{
			childTest.ok(false, "failed - got an error");
			childTest.end();
		});
	});
}

function ApiTestSuite()
{

}
ApiTestSuite.prototype.run = function(initialConfig)
{
	const cfg = Object.assign({}, initialConfig, {apiType: "RPC"} );

	var cf = new Configuration(cfg);
	var trest = new ApiTestSuiteOneCombination("API+REST+JSON", cf.amend({apiType: "REST"}));

	var trest = new ApiTestSuiteOneCombination("API+REST+JSON", cf.amend({apiType: "REST"}));
	trest.run();

	var trpc = new ApiTestSuiteOneCombination("API+RPC+JSON",cf.amend({apiType: "RPC", postSendJson:true, tokenInHeader: true}));
	trpc.run();

	var tRpcNoSendJson = new ApiTestSuiteOneCombination("API+RPC+NOTJSON", cf.amend({apiType:"RPC", postSendJson:false, tokenInHeader: true}));
	tRpcNoSendJson.run();

	var tNoCORS = new ApiTestSuiteOneCombination("API+RPC+NOTJSON", cf.amend({apiType:"RPC", postSendJson:false, tokenInHeader: false}));
	tNoCORS.run();
}
module.exports = ApiTestSuite;