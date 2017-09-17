/* eslint indent: 0 */
/* eslint no-unused-vars : 0 */
const ApiBase = require('./mixins/rest_base');
const DevApi = require('./mixins/rest_dev');
const UserApi = require('./mixins/rest_user');
const RawApi = require('./mixins/rest_raw');
/**
 * This class provides an interface to the backend REST Api.
  * 
 * It is deliberately only a shell that acquires its functions by pulling in a series of MIXINS.
 * This allows the construction of an RpcManager that has only the functions that are required
 * for any particular application rather than having a single amorphous class.
 * 
 * It is envisaged that api functions will be grouped in some manner and that each group
 * will be implemented as a MIXIN. These mixins will typically expect their host object to
 * provide certain properties and methods. To ensure correct setup for the functional mixins
 * if is necessary to include
 * 
 *  -   RpcApiBase, which itself includes Tracker, 
 * 
 * in advance of other mixins
 * 
 * When used in a real app it is expected that a custom RpcManager will be defined that
 * pulls in its functions using the technique demonstrated in this example.
 */
function RestApiManager(config)
{
    /**
     * Allow the constructor to be used as a factory function without the use of the 'new' keyword
     */
    if (! (this instanceof RestApiManager)) {
        let obj = new RestApiManager(config);
        return obj;
    }
    /**
     * NOTE - pull in the mixins for the specific functions we want this instance of the api manager to have
     */
    ApiBase.call(this, config);
    Object.assign(RestApiManager.prototype, ApiBase.prototype);

    RawApi.call(this);
    DevApi.call(this);
    UserApi.call(this);
    Object.assign(RestApiManager.prototype, RawApi.prototype, DevApi.prototype, UserApi.prototype);
    /**
     * mixins done
     */
}

module.exports = RestApiManager;
