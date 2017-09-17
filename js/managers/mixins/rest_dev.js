/* eslint indent: 0 */
/* eslint no-unused-vars : 0 */

/**
 * This is a mixin a set of functions related to testing and development.
 * 
 * It requires mixins:
 * 
 *  -   rest_base
 *  -   rest_raw
 *  
 */
function RestDevApi(config)
{

	/**
	 * Tests and error response
	 *
	 *	@param {string} errorType, valid values are
	 *		"200", "300", "400, "500", "json"
	 * @return     {Promise}  { description_of_the_return_value }
	 */
    this.testError = function testError (errorType)
	{
        const url = `/api/dev/error${errorType}`;
        const accessToken = this.getToken();
        return this.networkManager.get(this.url + url, accessToken, {});
    };

    this.testRuntime = function testRuntime()
	{
        return this.testError('_runtime');
    };
    this.testThrowError = function testThrowError()
	{
        return this.testError('_error');
    };
    this.testException = function testException()
	{
        return this.testError('_exception');
    };
    this.testJsonError = function testJsonError()
	{
        return this.testError('json');
    };

    this.databaseReload = function databaseReload()
	{
        const url = '/api/dev/dbreload';
        const accessToken = null;
        return this.networkManager.post(this.url + url, accessToken, {})
    };

    this.echo = function echo(data)
	{
        return this.networkManager.post(`${this.url}/api/echo`, null, data)
    };

    this.echoParameters = function echoParameters(p1, p2, p3)
    {

        return this.networkManager.post(`${this.url}/api/echo`, null, {one: p1, two: p2, three: p3})
    };
    
    this.adminSecret = function adminSecret(data)
	{
        const accessToken = this.getToken();
        return this.networkManager.get(`${this.url}/api/admin_secret`, accessToken, {});
    };
    this.userSecret = function userSecret(data)
	{
        const accessToken = this.getToken();
        return this.networkManager.post(`${this.url}/api/user_secret`, accessToken, {})
    };
    this.notSecret = function notSecret(data)
	{
        const accessToken = this.getToken();
        return this.networkManager.get(`${this.url}/api/not_secret`, accessToken, data)
    };
    
}

module.exports = RestDevApi;
