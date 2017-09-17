/**
 * Tests that are specific to a REST api - check get and post p[arameters are correctly received
 *
 * @type       {Function}
 */
const tape = require('tape');
const util = require('util');
const Api = require('managers/rest_manager.js');
const NetworkManager = require('managers/network_manager');
const Configuration = require('configuration');

function RestTestSuiteOne(label, config)
{
	this.config = config;
	this.nm = new NetworkManager(config);
	this.label = label;
}
RestTestSuiteOne.prototype.run = function run(reqType)
{
	this.testGetParameters();
	this.testPostParameters();
}
/**
 * Test that controllers can access parameters for both GET and POST request via request->getParms()
 */
RestTestSuiteOne.prototype.testGetParameters = function testGetParameters()
{
	const nm = this.nm;
	/**
	 * From these two tests can see that controllers access
	 * GET querystring values and POST body values through request->getParms()
	 * not through request->getParsedBody() - that only works for POST
	 */
	/**
	 * show that GET requests can also send nested objects
	 */
	tape.test(this.label+":"+"networkmanager-get - deep", function(childTest)
	{
		const params = {
			one : 111,
			two : "aaaa",
			b : {
				b1 : "111",
				b2 : "222"
			}
		}
		nm.get("http://local.api.stapp/api/echo", "1234567890", params)
		.then((response)=>
		{
			// console.log(["networkManager-get then", response.result]);
			childTest.equal(typeof response, 'object', "response is object");
			childTest.equal(response.error, null, "error is null" );

			childTest.equal(typeof response.result.parms.one, 'string', 'type of response.result.parms.one is string');
			childTest.equal(response.result.parms.one, '111', "one should be 111");
			childTest.equal(response.result.parms.two, 'aaaa', "a should be 'aaa'");
			childTest.equal(typeof response.result.parms.b.b1, 'string', "response contains b property");
			childTest.equal(response.result.parms.b.b1, '111', "b.b1 should be '111'");
			childTest.end();
		})
		.catch((err)=>
		{
			childTest.end();
		});
	});
}
	/**
	 * test that POST sends a full json encoded deep object
	 */
RestTestSuiteOne.prototype.testPostParameters = function testPostParameters()
{
	const nm = this.nm;
	tape.test(this.label+":"+"networkmanager-post", function(childTest)
	{
		const params = {
			one : 111,
			two : "aaaa",
			b : {
				b1 : "111",
				b2 : "222"
			}
		}
		nm.post("http://local.api.stapp/api/echo", "1234567890", params)
		.then((response)=>
		{
			console.log(response.result);
			childTest.equal(typeof response, 'object', "response is object");
			childTest.equal(response.error, null, "error is null" );

			childTest.equal(typeof response.result.parms.one, 'number', 'type of response.result.parms.one is number');
			childTest.equal(response.result.parms.one, 111, "one should be 111");
			childTest.equal(response.result.parms.two, 'aaaa', "a should be 'aaa'");
			childTest.equal(typeof response.result.parms.b.b1, 'string', "response contains b property");
			childTest.equal(response.result.parms.b.b1, '111', "b.b1 should be '111'");
			childTest.end();
		})
		.catch((err)=>
		{
			childTest.end();
		});
	});
}

function RestTestSuite()
{

}
RestTestSuite.prototype.run = function(initialConfig)
{
	let cfg = Object.assign({}, initialConfig, {apiType: "REST"});

	var cf = new Configuration(cfg);
	var trest = new RestTestSuiteOne("API+REST+JSON", cf.amend({apiType: "REST"}));
	trest.run();
}

module.exports = RestTestSuite;
