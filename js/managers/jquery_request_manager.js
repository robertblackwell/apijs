/* eslint indent: 0 */
const $ = require('jquery');
const _ = require('underscore');
const errorHandler = require('./error_manager.js');

/**
 * This class provides a method to make http requests in
 * a browser enviroment using Jquery.ajax

 * NOTE - canot change to ES6 class because of the trick pulled in rqeuest_manager.js
 *
 * @class      RequestJQuery (name)
 * @param      {<type>}   cfg     The configuration
 * @return     {Promise}  { description_of_the_return_value }
 */
function JqueryRequestManager(cfg)
{
    /* eslint-disable no-unused-vars */
	/*
	 * Performs a http request. Results are returned via a promise.
	 * The promise returns either response object or
	 * on fail and errorPacket appropriate to the type of error.
	 *
     * Only options permitted are:
     * -    contentType - which sets the content-type header
     * -    accept - which sets the accept header 
	 */     
    this.request = function requestJquery(url, method, data, headers)
    /* eslint-enable no-unused-vars */
	{
        const opts = { url : url, method : method, data: data, headers : headers };
        const _options = _.extend(opts, {});

        const promise = $.Deferred();
        const p = $.ajax(_options);

        p.done((response, status, xhr) =>
		{
			/**
			 * jQuery considers all 2XX and 304 status codes as success
			 * all others are considered errors. So at this point the status
			 * must be a 2XX or 304. Moreover we will only get here if the JSON
			 * inside the response body was correctly parsed.
			 * Hence this will only be an error if something
			 * in the response object tells us this is an error; that is indicated
			 * by the existence of response.error value.
             *
             * NOTE - the response should BE a jsonrpc packet, that is with this format
             * 
             * {
             *      jsonrpc : '2.0'
             *      result : {}
             *      error : {}
             *      id : nn
             *  }   
			 */
            if( response.jsonrpc === undefined 
                || response.result === undefined 
                || response.error === undefined)
                throw new Error("response packet not jsonrpc");

            if (response.error === null)
			{
                response.status = xhr.status;
                response.statusText = xhr.statusText;
                promise.resolve(response);
            }
            else
			{
                promise.reject(errorHandler.createErrorPacket(xhr, status));

                return;
				// promise.reject(errorHandler.appErrorPacket(response, status, xhr))
            }
        });
        p.fail((xhr, errorStatus, errorThrown) =>
		{
            console.log(errorStatus);
            promise.reject(errorHandler.createErrorPacket(xhr, errorStatus, errorThrown));

            return;
        });

        return promise.promise();
    };
}

module.exports = JqueryRequestManager;
