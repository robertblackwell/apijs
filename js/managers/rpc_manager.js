/* eslint indent: 0 */
/* eslint no-unused-vars : 0 */
const RpcApiBase = require('./mixins/rpc_base');
const DevApi = require('./mixins/rpc_dev');
const UserApi = require('./mixins/rpc_user');
const RawApi = require('./mixins/rpc_raw');

/**
 * This class provides an interface to the backend JsonRpc api.
 * 
 * It is deliberately only a shell that acquires its functions by pulling in a series of MIXINS.
 * This allows the construction of an RpcManager that has only the functins that are required
 * rather than having a single amorphous class.
 * 
 * It is envisaged that api functions will be grouped in some manner and that each group
 * will be implemented as a MIXIN. THese mixins will typically excpect their host object to
 * provide certain properties and methods. To ensure correct setup for the functional mixins
 * if is necessary to include
 * 
 *  -   RpcApiBase, which itself inclode Tracker, 
 * 
 * in advance of other mixins
 * 
 * When used in a real app it is expected that a custom RpcManager will be defined that
 * pulls in its functions using the technique demonstrated in this example.
 */
function RpcApiManager(config)
{
    /**
     * Allow the constructor to be used as a factory function without the use of the 'new' keyword
     */
    if (! (this instanceof RpcApiManager)) {
        let obj = new RpcApiManager(config);
        return obj;
    }

    // initialize the non prototype properties and methods
    RpcApiBase.call(this, config)

    // now initialize the prototype
    Object.assign(RpcApiManager.prototype, RpcApiBase.prototype);
    /**
     * Now that the environment has been initialized include the function mixins
     */
    RawApi.call(this); 
    DevApi.call(this);
    UserApi.call(this);
    Object.assign(RpcApiManager.prototype, RawApi.prototype, DevApi.prototype, UserApi.prototype);
}

module.exports = RpcApiManager;
