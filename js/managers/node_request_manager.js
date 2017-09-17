/* eslint indent: 0 */
const util = require('util');
const request = require('request');
const errorHandler = require('./error_manager.js');

/**
 * This class provides a method for making http requests in a nodejs
 * environment.
 *
 * NOTE - canot change to ES6 class because of the trick pulled in rqeuest_manager.js
 *
 * @class      HttpManager (name)
 * @param      {<type>}   cfg     The configuration
 * @return     {Promise}  { description_of_the_return_value }
 */
function NodeRequestManager(cfg)
{
    
    const defaultCfg = {
        postSendJson : true    // send JSON rather than standard body
    }
    const config = Object.assign({}, defaultCfg, cfg);

    this.request = (url, method, data, headers) =>
    {
        // console.log(["RequestNode::request ", url, method, util.inspect(data), "typeof data : " + (typeof data), headers]);
        var options = {
            method: method,
            uri: url,
            headers: headers,
            // proxy: "http://localhost:8888"
        };
        if( ["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
            //
            // The data has already been jsonized before it gets here
            //
            if (config.postSendJson === true) {
                options.json = false;
                options.body = (typeof data === 'string') ? data : JSON.stringify(data); 
            } else {
                options.json = false;
                options.form = data; 
            }

        } else if (['GET'].includes(method)) {
            options.qs = data;
        }
        // console.log(["RequestNode::request ", util.inspect(options)]);

        return new Promise( (resolve, reject) =>
        {
            request(options, (error, incomingMessage, responseBody) => 
            {
                // console.log("RequestNode::request CB");
                var responseObject = undefined;
                if (!error) 
                {
                    try {
                        responseObject = JSON.parse(incomingMessage.body);
                    } catch (er) {
                        responseObject = undefined;
                    }
                    var xhr = {
                        status : incomingMessage.statusCode,
                        statusText : incomingMessage.statusMessage,
                        responseText : incomingMessage.body,
                        responseJSON : responseObject,
                    }
                    var status = incomingMessage.statusCode;
                    var statusText = incomingMessage.statusMessage;
                    var body = incomingMessage.body;
                    var responseObject = responseObject;
                    /**
                     * Emulate jQuery.ajax treatment of http status
                     */
                    if ((status >= 200 && status < 300) || (status === 304))
                    {
                        if (responseObject === undefined
                            || responseObject.jsonrpc === undefined 
                            || responseObject.result === undefined 
                            || responseObject.error === undefined)
                        {
                            reject(errorHandler.createErrorPacket(xhr, status));
                        }   
                        else if (responseObject.error === null)
                        {
                            responseObject.status = xhr.status;
                            responseObject.statusText = xhr.statusText;
                            resolve(responseObject);
                        }
                        else
                        {
                            reject(errorHandler.createErrorPacket(xhr, status));
                        }
                    }
                    else
                    {
                        reject(errorHandler.createErrorPacket(xhr, status));
                    }
                }
                else 
                {
                    var xhr = {
                        status : 0,
                        statusText : "not known",
                    }
                    console.log(error);
                    reject(errorHandler.createErrorPacket(xhr, error.code, error.message));
                }
            });
        });
    }
}
debugger;
module.exports = NodeRequestManager;
