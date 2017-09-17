/**
 * RPC specific tests - test rpc handler gets parameters correctly
 *
 * @type       {Function}
 */
const tape = require('tape');
const util = require('util');
const Api = require('managers/rest_manager.js');
const NetworkManager = require('managers/network_manager');
const RpcManager = require('managers/rpc_manager');
const Configuration = require('configuration');

function RpcTestSuiteOne(label, config)
{
	this.config = config;
}

RpcTestSuiteOne.prototype.run = function run()
{
	this.testRpcEcho ("RPC+JSON", this.config);
}
RpcTestSuiteOne.prototype.testRpcEcho = function testRpcEcho(label, cfg)
{
	/**
	 * Configure the networkManager
	 */
	const nm = new NetworkManager(cfg);
	/**
	 * show that rpc requests can also send nested objects
	 */
	tape.test(label+":"+"networkmanager- rpcEcho", function(childTest)
	{
			// dev.echo(one, two) 
		const params = {
			one : 111, // note its a number
			two : {
				b1 : "111", //note it is a string
				b2 : "222"
			}
		}
		nm.rpc("http://local.api.stapp/api/rpc", "dev.echo",  "1234567890", params)
		.then((response)=>
		{
			// console.log(["networkManager-get then", response.result]);
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
			// console.log(err);
			childTest.end();
		});

	});
}
function RpcTestSuite()
{

}
RpcTestSuite.prototype.run = function(initialConfig)
{
	let cfg;
	let cf;

	cfg = Object.assign({}, initialConfig, {
		apiType: "RPC",
		apiConstructor : function(config) {
			return new RpcManager(config);
		}
	} );

	cf = new Configuration(cfg);

	var trpc = new RpcTestSuiteOne("API+RPC+JSON",cf.amend({postSendJson:true, tokenInHeader: true}));
	trpc.run();

	var tRpcNoSendJson = new RpcTestSuiteOne("API+RPC+NOTJSON+H", cf.amend({postSendJson:false, tokenInHeader: true}));
	tRpcNoSendJson.run();

	var tNoCORS = new RpcTestSuiteOne("API+RPC+NOTJSON+NOTH", cf.amend({postSendJson:false, tokenInHeader: false}));
	tNoCORS.run();
}
module.exports = RpcTestSuite;
