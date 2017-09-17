/* eslint indent: 0 */
/* eslint no-unused-vars : 0 */

/**
 * This is a mixin for an api manager that provides user login/logout/registration/password
 * change and reset functions.
 * 
 * It requires mixins
 *  -   RpcBase
 *  -   RpcRaw
 * 
 */
function RpcApiUserMixin(config)
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
            this.rpcCall("user.login", null, {username : username, password: password})
			.then((response) =>
			{
                // should be a new token
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
            this.rpcCall("user.logout", accessToken, {})
			.then((response) =>
			{
                // clear logged in token
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
            this.rpcCall("user.register", null, data)
			.then((response) =>
			{
                // new registered user should be logged in record token
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
            this.rpcCall("user.deregister", accessToken, {})
			.then((response) =>
			{
                // this has the effect of logout
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
        return this.rpcCall(`user.changePassword`, accessToken, data);
    };

    this.resetPassword = function resetPassword(usernameOrEmail)
	{
        const data = {
            /* eslint-disable quote-props */
            'username_or_email' : usernameOrEmail,
            /* eslint-ensable quote-props */
        };

        return this.rpcCall(`user.passwordReset`, null, data);
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

        return new Promise((resolve, reject) =>
		{
            this.rpcCall(`user.passwordResetApply`, null, data)
			.then((response) =>
			{
                this.updateUserModel(response);
                resolve(response);
            })
			.catch((err) =>
			{
                reject(err);
            });
        });
    };

}

module.exports = RpcApiUserMixin;
