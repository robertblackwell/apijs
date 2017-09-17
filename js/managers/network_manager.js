/* eslint indent: 0 */
const querystring = require('querystring');
const errorHandler = require('managers/error_manager');
const ResponseModel = require('../response_model');
const requestManagerFactory = require("request_manager_factory");

let responseModel = new ResponseModel();

/**
 * Tests whether an object is suitable for serializing as a query string
 * or application/x-www-form-urlencoded. 
 * An object is suitable if all properties are strings, numbers or arrays
 * but no property can be another object
 *
 * @param      {mixed}   obj     The object
 * @return     {boolean}  True if suitable object, False otherwise.
 */
function isSuitableObject(obj)
{
    for(var propt in obj){
        if (propt !== null && ( typeof(propt) === 'object'))
            return false;
    }
    return true;
}
/**
 * This class provides a set of method calls that will provide the
 * basis for accessing the Stapp backend API.
 * 
 * In particular the following methods are exposed:
 * this.rpc(url, rpcMethod, accessToken, paramsObject)
 * this.get(url, accessToken, data)
 * this.post(url, accessToken, data)
 * this.put(url, accessToken, data)
 * this.delete(url, accessToken, data)
 * 
 * This class does not make the http requests itself but
 * calls to a requestManager object that is passed in as part of the config object.
 * This is to facilitate the use of this class in both a node and browser environment
 * without this class needing logic to handle the two different situations,.
 * 
 * Further this class intercepts all responses and processes then to check
 * for various kinds of errors and provides the logic for decicing whether to pass a 
 * valid response object or an error object to higher levels. an instance
 * of ErrorManager is used to construct error responses.
 * 
 * This class maintains a "model" object (via getResponseModel()) accessible to outside code that keeps
 * details of the latest response so that application code can use this mode to display
 * details of the raw response object if required. 
 * 
 * @class      NetworkManager 
 * @param      {array}   cfg     The configuration
 * @return     {NetworkManager}  
 */
class NetworkManager
{
    constructor(cfg)
    {
        const defaultCfg = {
            tokenInHeader : true, // token in query string or post/put/delete body
            postSendJson : true    // send JSON rather than standard body
        }
        const config = Object.assign({}, defaultCfg, cfg);
        this.config = config;
        this.responseModel = new ResponseModel();
        this.requestManager = requestManagerFactory(this.config);
        this.httpRequestFunc = this.requestManager.request;
    }    
    getResponseModel()
    {
        return this.responseModel;
    }

    /**
     * Performs a generic rpc call
     *
     * @param      {string} url Full url of json rpc accesspoint
     * @param      {string}  rpcMethod     The rpc method
     * @param      {string}   accessToken   The access token
     * @param      {object}   paramsObject  The parameters object
     * @return     {Promise}  
     */
    rpc(url, rpcMethod, accessToken, paramsObject)
    {
        var pObj;
        if (this.config.postSendJson) {
            pObj = paramsObject;
        } else {
            pObj = JSON.stringify(paramsObject);
        }
        let p = {
            jsonrpc : '2.0',
            id : 1,
            method : rpcMethod,
            params : pObj
        }
        return this.post(url, accessToken, p)
    }

    /**
     * Issues a get request passing the arguments as a query string
     *
     * NOTE : the request will not trigger CORS
     *
     * @param      {string}  url          The url
     * @param      {string}  accessToken  The access token
     * @param      {object}  data         single level hierachy only, key/value pairs
     * @return     {Promise} 
     */
    get(url, accessToken, data)
	{
        if(! isSuitableObject(data)) {
            alert("networkmanager::get - object is not suitable");
            throw new Error("netwrokmanager::get - object is not suitable");
        }

        const options = {
            headers: {
                accept : 'application/json',
            },
        };

        if (this.config.tokenInHeader) {
            options.headers['x-token'] = accessToken;
        } else {
            if (data === null) {
                data = {token : accessToken}
            } else {
                data.token = accessToken;
            }
        }        
        options.data = data;

        return this.httpRequest(url, 'GET', options.data, options.headers);
    };

    post(url, accessToken, data)
	{
        return this.common('POST', url, accessToken, data);
    };
    put(url, accessToken, data)
	{
        return this.common('PUT', url, accessToken, data);
    };
    patch(url, accessToken, data)
	{
        return this.common('PATCH', url, accessToken, data);
    };
    delete(url, accessToken, data)
	{
        return this.common('DELETE', url, accessToken, data);
    };
    common(method, url, accessToken, data)
	{

        const options = {
            // dataType : 'json',
            // contentType : 'application/json',
            // accept : 'application/json',
            headers : {
                'content-type' : 'application/json',
                'accept' : 'application/json'
            },
        };

        if (this.config.tokenInHeader) {
            options.headers['x-token'] = accessToken;        
        } else {
            if (data === null) {
                data = {token : accessToken}
            } else {
                data.token = accessToken;
            }
            if(! isSuitableObject(data)) {
                alert("networkmanager::post - object is not suitable");
                throw new Error("networkmanager::post - object is not suitable");
            }
        }

        if (this.config.postSendJson) {
            // options.contentType = "application/json";
            options.headers['content-type'] = 'application/json';
            options.data = JSON.stringify(data);        
        } else {
            // options.contentType = 'application/x-www-form-urlencoded';
            options.headers['content-type'] = 'application/x-www-form-urlencoded';
            options.data = data;
        }

        return this.httpRequest(url, method, options.data, options.headers);
    };
    resetToken()
	{
        this.token = null;
    };
    setToken(token)
	{
        this.token = token;
    };
	/**
	 * Converts _httpRequest to Promise rather than jquery deffered
	 *
	 * @param      {string}            url      The url
	 * @param      {string}            method   The method
     * @param      {object|string}      data    The request content
	 * @param      {object}            headers  Http headers
	 * @return     {Promise}   { description_of_the_return_value }
	 */
    httpRequest(url, method, data, headers)
	{
        return new Promise((resolve, reject) =>
        {
            // console.log(["NetworkManager::httpRequest", url, method, data, headers]);
            this.httpRequestFunc(url, method, data, headers)
			.then((response) =>
            {
                this.responseModel.reportSuccess(response);
                resolve(response);
            })
			.catch((err) =>
            {
                this.responseModel.reportFailure(err);
                reject(err);
            });
        });
    };
	/*
	 * Performs a http request. Results are returned via a promise.
	 * The promise returns either response object or
	 * on fail and errorPacket appropriate to the type of error.
	 *
     * Only options permitted are:
     * -    contentType - which sets the content-type header
     * -    accept - which sets the accept header 
	 */
    /* eslint-disable no-unused-vars */
    _httpRequest(url, method, data, headers)
    /* eslint-enable no-unused-vars */
	{
        const opts = { url : url, method : method, data: data, headers : headers };
        const _options = _.extend(opts, {});

        return new Promise( (resolve, reject) => 
        {
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
                    resolve(response);
                }
                else
    			{
                    reject(errorHandler.createErrorPacket(xhr, status));
                    return;
                }
            });
            p.fail((xhr, errorStatus, errorThrown) =>
    		{
                console.log(errorStatus);
                reject(errorHandler.createErrorPacket(xhr, errorStatus, errorThrown));

                return;
            });
        });
    };
}

module.exports = NetworkManager;
