
/**
 * This is an IMMUTABLE  configuration object. The contructor returns a default instance, with
 * and recommended config values based on sysMode, environment browser/cli, and api type
 * (REST/JsonRpc) 
 * 
 * The instance is suitable for passing to constructors of all managers.
 * 
 * The config values held by an instance can be amended to create a new instance 
 * by a call to config.amend(options)
 *
 *	where options is an object with any of these possible values
 *
 *	apiUrl : 
 *	requestType : 
 *	apiType : 
 *	postSendJson : 
 *	tokenInHeader : 
 *
 * @class      Configuration (name)
 * @param      {<type>}  options  The options
 * 
 * 
 * Configuration for the sample app is set in the config/{sysmode}.config.js file
 * 
 */
function Configuration(options)
{

	const defaultOptions = {
		sysMode		: 'LOCAL', // possible values LOCAL | STAGE | PROD
		requestType : 'JQUERY_REQUEST',   // possible values JQUERY | NODE
		apiType 	: "RPC",   // possible values RPC | REST
		// to configure charles need to add this next bit to the config
        // proxy		: "http://localhost:8888"
	}

	const newOptions = Object.assign({}, defaultOptions, options);

	this.configProperties = [
		'apiUrl', 
		//
		// these next two cannot be amended and there is no default value
		// actual values MUST be provided
		//
		'requestType', 			// redundant as the requestConstructor superceeds
		'requestConstructor',	// a closure that constructs the required request manager
		
		//
		// these next two cannot be amended and there is no default value
		// actual values MUST be provided
		//
		'apiType', 		
		'apiConstructor',		// a closure that constructs a suitable api manager

		'postSendJson', 
		'tokenInHeader',
		'proxy'
	];

	this.options = newOptions;

	if (this.options.requestConstructor === undefined) {
		throw Error(`Configuration::constructor requestConstructor must not be undefined`);
	}

	if (this.options.apiConstructor === undefined) {
		throw Error(`Configuration::constructor apiConstructor must not be undefined`);
	}

	this.configValues = {
		requestConstructor : newOptions.requestConstructor,
		apiConstructor : newOptions.apiConstructor,
	};
	if (newOptions.proxy !== undefined)
		this.configValues.proxy = newOptions.proxy;
	/**
	 * base url for the api is http://{sysmode}.api.stapp
	 */
	this.configValues.apiUrl = `http://${this.options.sysMode.toLowerCase()}.api.stapp`;
	if (this.options.requestType === "JQUERY_REQUEST") {
		this.configValues.requestType =  "JQUERY_REQUEST";
		/**
		 * proxy setting has no meaning for browser requests
		 */
		delete this.configValues.proxy;
		if (this.options.apiType === "REST") {
			// when using a REST backend interface we want to be pure - too bad about CORS 
			this.configValues.apiType = "REST";
			this.configValues.postSendJson = true;
			this.configValues.tokenInHeader = true;
		} else if (this.options.apiType === "RPC") {
			// when using RPC backend interface we want to avoid CORS - not pure - so dont use 
			// special headers and dont use JSON content type
			this.configValues.apiType = "RPC";
			this.configValues.postSendJson = false;
			this.configValues.tokenInHeader = false;
		} else {
			throw Error(`Configuration - invalid apiType : ${this.options.apiType}`);
		}

	} else if (this.options.requestType === "NODE_REQUEST") {
		this.configValues.requestType = "NODE_REQUEST";
		if (this.options.apiType === "REST") {
			// when using a REST backend interface we want to be pure - no CORS in this environment 
			this.configValues.apiType = "REST";
			this.configValues.postSendJson = true;
			this.configValues.tokenInHeader = true;
		} else if (this.options.apiType === "RPC") {
			// no CORS in this environment but why change
			this.configValues.apiType = "RPC";
			this.configValues.postSendJson = false;
			this.configValues.tokenInHeader = false;
		} else {
			throw Error(`Configuration - invalid apiType : ${this.options.apiType}`);
		}

	} else {
		throw Error(`Configuration - invalid requestType : ${this.options.requestType}`);
	}
	this.installValues();

	// this.installValues = function installValues()
	// {
	// 	for( let p of this.configProperties) {
	// 		this[p] = this.configValues[p];
	// 	}
	// }.bind(this);

	/**
	 * This creates a new Coonfiguration object
	 *
	 * @param      {<type>}  newValues  The new values
	 */
	this.amend = function(newValues)
	{
		var newOptions = Object.assign({}, this.options, newValues);
		var obj = new Configuration(newOptions);

		for( let p of this.configProperties) {
			if (newValues.hasOwnProperty(p)) {
				if (p === 'requestType') {
					throw Error('Configuration::amend cannot amend requestType');
				}
				if (p === 'requestConstructor') {
					throw Error('Configuration::amend cannot amend requestConstructor');
				}
				obj.configValues[p] = newValues[p];
			}
		}
		obj.installValues();
		return obj;
	}.bind(this);
}
Configuration.prototype.installValues = function installValues(values)
{
	for( let p of this.configProperties) {
		this[p] = this.configValues[p];
	}
};

module.exports = Configuration;