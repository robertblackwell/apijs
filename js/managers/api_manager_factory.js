/* eslint indent: 0 */

/**
 * Just a switch to select the desired api REST or RPC
 */
const RpcManager = require('managers/rpc_manager');
const RestManager =require('managers/rest_manager');
/**
 * Dynamic inheritence
 * 
 * Note there is a bit of trickery going on behind the scenes here.
 * The clue is th euse of the getMyId() call -- cannot check
 * prototype chains or constructor names as we are using object
 * extension to create these managers
 *
 * @param      {array}  cfg     The configuration
 * 	the only property of interest is 
 * 	{
 *		api : "REST" | "RPC"
 * 	}
 */
module.exports = function ApiManagerFactory(cfg)
{
    const defaultCfg = {
        apiType : "RPC", // token in query string or post/put/delete body
    }
    const config = Object.assign({}, defaultCfg, cfg);


    if ( config.apiType === "RPC") {
    	// const rpc = new RpcManager(config);
        const rpc = RpcManager(config);
    	return rpc;

    } else if (config.apiType === "REST") {
    	const rest = RestManager(config);
    	return rest;
    } else {
    	throw(`ApiManagerFactory invalid api valie in config : ${config.apiType}`);
    }

}

