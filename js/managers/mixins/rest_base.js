/* eslint indent: 0 */
/* eslint no-unused-vars : 0 */
const NetworkManager = require('../network_manager');
const Tracker = require('./tracker');
/**
 * This class provides some of the requirements for Api functional mixins
 * 
 */
function RestApiBase(config)
{
    this.url = config.apiUrl;
    this.config = config;
    this.networkManager = new NetworkManager(config);
    Tracker.call(this);
    Object.assign(RestApiBase.prototype, Tracker.prototype);

    this.getResponseModel = function getResponseModel()
    {
        return this.networkManager.getResponseModel();
    };
	
    
    this.getMyId = function getMyId()
    {
        return "RestManager";
    }
}

module.exports = RestApiBase;
