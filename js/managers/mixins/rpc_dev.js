/* eslint indent: 0 */
/* eslint no-unused-vars : 0 */

/**
 * This is a mixin a set of functions related to testing and development.
 * 
 * It requires mixins:
 * 
 *  -   rpc_base
 *  -   rpc_raw
 *  
 */
function RpcDevApiMixin()
{
	/**
	 * Tests and error response
	 *
	 *	@param {string} errorType, valid values are
	 *		"200", "300", "400, "500", "json"
	 * @return     {Promise}  { description_of_the_return_value }
	 */
    this.testError = function testError(errorType)
	{
        const method = humps.camelize(`dev.error${errorType}`);
        const accessToken = this.getToken();
        return this.rpcCall(method, accessToken, {});
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
        return this.testError('_json');
    };

    this.databaseReload = function databaseReload()
	{
        const url = '/api/dev/dbreload';
        const accessToken = null;
        return this.rpcCall("dev.dbreload", accessToken, {});
    };

    this.echo = function echo(data)
	{
        this.networkManager.setToken('0192837465');
        return this.rpcCall(`dev.echo`, null, data);
    };

    this.echoParameters = function echoParameters(p1, p2, p3)
    {

        return this.rpcCall(`dev.echoParameters`, null, {one:p1, two:p2, three:p3});
    };

    this.adminSecret = function adminSecret(data)
	{
        const accessToken = this.getToken();
        return this.rpcCall(`dev.adminSecret`, accessToken, {});
    };
    this.userSecret = function userSecret(data)
	{
        const accessToken = this.getToken();
        return this.rpcCall(`dev.userSecret`, accessToken, {});
    };
    this.notSecret = function notSecret(data)
	{
        const accessToken = this.getToken();
        return this.rpcCall(`dev.notSecret`, accessToken, {});
    };

}

module.exports = RpcDevApiMixin;
