/* eslint indent: 0 */
/* eslint no-unused-vars : 0 */

/**
 * This mixin proclass provides access to the raw jsonRpc call
 */
function RpcApiRawMixin(config)
{
    /**
     * could also include mixin for rest_raw if you anted to get
     * access to get/post/put/delete methods directly
     */

    /**
     * Performs a generic rpc call
     *
     * @param      {<type>}   rpcMethod     The rpc method
     * @param      {<type>}   accessToken   The access token
     * @param      {<type>}   paramsObject  The parameters object
     * @return     {Promise}  { description_of_the_return_value }
     */
    this.rpcCall = function rpcCall(rpcMethod, accessToken, paramsObject)
    {
        return this.networkManager.rpc(`${this.url}/api/rpc`, rpcMethod, accessToken, paramsObject);
    }

}

module.exports = RpcApiRawMixin;
