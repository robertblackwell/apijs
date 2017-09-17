/* eslint indent: 0 */

/**
 * A factory function to create the appropriate type of RequestManager.
 * 
 * There are two RequestManager's possible:
 *  -   if in a browser environment this function creates a
 *      request manager that uses jQuery.ajax() to make requests to the api.
 *      This is encapsulated in the class JqueryRequestManager
 *      that lives in managers/jquery_request_manager
 *      
 *  -   if in a node environment the request manager created 
 *      uses the node package 'request' to make requests to the api.   
 *      This is encapsulated in class NodeReqiuestManager
 *      which lives in the module managers/node_request_manager
 *
 *  The function determines which request manager to create by examining
 *  the requestType property in the config object.
 *  
 *  NOTE: The way this function works the webpack bundling process
 *  bundles in both request managers at build time and the selection of
 *  the appropriate one is made at runtime.
 *  
 *  There is a problem with this approach as when bundling for 
 *  a browser environment the inclusion of the node module 'request'
 *  causes a runtime/build error. To overcome this
 *  the webpack config file for a browser environment provides an alias
 *  for 'node_request_manager' that points at an empty node_request_manager module 
 *
 * @TODO : find a better way to do this
 *
 * @param      {array}  cfg     The configuration
 * 	the only property of interest is 
 * 	{
 *		requestType : "JQUERY_REQUEST" | "NODE_REQUEST"
 * 	}
 */
module.exports = function requestManagerFactory(cfg)
{
    return cfg.requestConstructor(cfg);
}

