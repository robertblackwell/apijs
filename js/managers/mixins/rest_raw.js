/* eslint indent: 0 */
/* eslint no-unused-vars : 0 */

/**
 * This mixin provide access to 
 * raw http method calls.
 * 
 * It requires the following mixins to be included
 * 
 *  -   rest_base
 *  
 */
function RestRawApi(config)
{

    this.get = function _get(path, accessToken, data)
	{
        return this.networkManager.get(`${this.url}/${path}`, accessToken, data)
    };
    this.post = function _post(path, accessToken, data)
    {
        return this.networkManager.post(`${this.url}/${path}`, accessToken, data)
    };
    this.put = function _put(path, accessToken, data)
    {
        return this.networkManager.put(`${this.url}/${path}`, accessToken, data)
    };
    this.delete = function _delete(path, accessToken, data)
    {
        return this.networkManager.delete(`${this.url}/${path}`, accessToken, data)
    };
    this.patch = function _patch(path, accessToken, data)
    {
        return this.networkManager.patch(`${this.url}/${path}`, accessToken, data)
    };    
}

module.exports = RestRawApi;
