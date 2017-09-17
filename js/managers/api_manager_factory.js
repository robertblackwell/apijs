/* eslint indent: 0 */

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
    return cfg.apiConstructor(cfg);
}

