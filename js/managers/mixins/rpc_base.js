/* eslint indent: 0 */
/* eslint no-unused-vars : 0 */
const NetworkManager = require('../network_manager');
const Tracker = require('./tracker');


/**
 * This class provides some of the requirements for Api functional mixins
 * 
 */
function RpcApiBase(config)
{
    this.url = config.apiUrl;
    this.networkManager = new NetworkManager(config);
    Tracker.call(this);
    Object.assign(RpcApiBase.prototype, Tracker.prototype);

    this.getResponseModel = ()=>
    {
        return this.networkManager.getResponseModel();
    };
    
    this.getMyId = function getMyId()
    {
        return "RpcManager";
    }

}

module.exports = RpcApiBase;
