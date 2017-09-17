/* eslint indent: 0 */
/* eslint no-unused-vars : 0 */

/**
 *  This mixin provides functions related to user login, logout, registration, password change and reset.
 *  
 *  It requires the following mixins to also be included
 *  
 *      -   rest_base
 *      -   rest_raw
 */
function RestApiUserMixin(config)
{

    /**
     * Makes a login request to the backend API. If a user is already
     * logged in this will log them out and login the given username
     * This function causes the token returned by the server to be
     * saved for future calls.
	 *
	 * @param      {string}   username  The username
	 * @param      {string}   password  The password
	 * @return     {Promise}  { description_of_the_return_value }
	 */
    this.login = function login(username, password)
	{
        return new Promise((resolve, reject) =>
        {
            this.networkManager.post(`${this.url}/api/user_auth/login`, null, { username : username, password : password })
			.then((response) =>
			{
                // record the new token
                this.updateUserModel(response);
                resolve(response);
            })
			.catch((err) =>
			{
                reject(err);
            });
        });
    };
	/**
     * Logs out the current user. Also invalidates the saved token
     * assigning the defaultUser to userModel 
	 *
	 * @return     {Promise}  { description_of_the_return_value }
	 */
    this.logout = function logout()
	{
        const accessToken = this.getToken();

        return new Promise((resolve, reject) =>
        {
            this.networkManager.post(`${this.url}/api/user_auth/logout`, accessToken, {})
			.then((response) =>
			{
                // invalidate the logged in token
                this.defaultUser();
                resolve(response);
            })
			.catch((err) =>
			{
                reject(err);
            });
        });
    };
	/**
	 * Register a new user. On successful return the newly registered user is logged in.
	 * The response is used to update the ApiManagers internal userModel
	 *
	 * @param      {string}   username  The username
	 * @param      {string}   email     The email
	 * @param      {string}   password  The password
	 * @return     {Promise}  { description_of_the_return_value }
	 */
    this.register = function register(username, email, password)
	{
        const data = {
            username : username,
            email : email,
            password : password,
        };

        return new Promise((resolve, reject) =>
        {
            this.networkManager.post(`${this.url}/api/user_auth/register`, null, data)
			.then((response) =>
			{
                // has the effect of login
                this.updateUserModel(response);
                resolve(response);
            })
			.catch((err) =>
			{
                reject(err);
            });
        });
    };

	/**
	 * Deregisters the current (logged in) user by loggin that user out and deleting
	 * the users record from the system. A user must be logged in,
	 *
	 * On success sets the userModel to some default value that represents
	 * an unknown not logged in user.
	 *
	 * @return     {Promise}  				{ description_of_the_return_value }
	 */
    this.deRegister = function deRegister()
	{
        const accessToken = this.getToken();

        return new Promise((resolve, reject) =>
        {
            this.networkManager.post(`${this.url}/api/user_auth/deregister`, accessToken, {})
			.then((response) =>
			{
                // has the effect of logout
                this.defaultUser();
                resolve(response);
            })
			.catch((err) =>
			{
                reject(err);
            });
        });
    };

    this.changePassword = function changePassword(newPassword)
	{
        const data = {
            /* eslint-disable quote-props */
            'new_password' : newPassword,
            /* eslint-ensable quote-props */
        };
        const accessToken = this.getToken();
        return networkManager.post(`${this.url}/api/user_auth/change_password`, accessToken, data);
    };

    this.resetPassword = function resetPassword(usernameOrEmail)
	{
        const data = {
            /* eslint-disable quote-props */
            'username_or_email' : usernameOrEmail,
            /* eslint-ensable quote-props */
        };
        return networkManager.post(`${this.url}/api/user_auth/password_reset`, null, data)
    };

    /**
     * Completes the password reset process by logging the user in.
     * Hence also sets the userModel to the logged-in user
     *
     * @param      {<type>}   passwordResetToken  The password reset token
     * @return     {Promise}  { description_of_the_return_value }
     */
    this.resetPasswordComplete = function resetPasswordComplete(passwordResetToken)
	{
        const data = {
            token : passwordResetToken,
        };
        return this.networkManager.post(`${this.url}/api/user_auth/password_reset_apply`, null, data);
        // this mght not be obsolete - maybe need to update the current user - test it
        return new Promise((resolve, reject) =>
		{
            this.networkManager.post(`${this.url}/api/user_auth/password_reset_apply`, null, data)
			.then((response) =>
			{
                resolve(response);
            })
			.catch((err) =>
			{
                reject(err);
            });
        });
    };
}

module.exports = RestApiUserMixin;
