/* eslint indent: 0 */
/* eslint no-unused-vars : 0 */
const Backbone = require('backbone');

const UserModel = Backbone.Model.extend(
    {
        defaults : {
            username : '',
            password : '',
            token : null,
        },
    });

const userModel = new UserModel();

/**
 *
 * This class (A MIXIN) provides methods for keeping track of the currently logged in user with an internal
 * STATIC userModel (of type Backbone.Model). It is intended only ever to be used as an amalgamation onto
 * a more complete api manager.
 * 
 * The userModel is accessible so that it can be used with views to display the username
 * (and perhaps other details) of the currently logged in user.
 *
 *	The userModel is a static variable so that mutiple instances of this MIXIN
 * will not get confused about the current user.
 * 
 */
function Tracker()
{
    
	/**
	 * Allows client code access to the userModel for binding to a view
	 * in order to display the logged in user name
	 *
	 * @return     {Backbone.Model}  The user model.
	 */
    this.getUserModel = function getUserModel()
	{
        return userModel;
    };
    this.getToken = function getToken()
    {
        return userModel.get('token');
    }
    /**
	 * Updates the userModel with the username and token from the response object
	 *
	 * @param      {object}   response  The response
	 */
    this.updateUserModel = function updateUserModel(response)
	{
        const accessToken = response.result.token;
        const username = response.result.username;
		// let password = response.password;
		// let email = response.email;

        userModel.set({ token : accessToken, username : username, password : 'YYYYYY', email : 'email' });
    };

	/**
	 * Sets the userModel to some default "not logged in" value
	 *
	 */
    this.defaultUser = function _defaultUser()
	{
        const defUser = { username : 'a_username', token : null, email : 'an_email', password : 'a_password' };

        userModel.set(defUser);
    };

    this.invalidateUser = function invalidateUser()
    {
        this.defaultUser();
    }
}


module.exports = Tracker;
