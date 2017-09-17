const Configuration = require("../js/app/configuration");

module.exports = new Configuration({
	sysMode : "local",
	apiType: "RPC",
	/**
	 * This combination of config options avoids Cors
	 */
	tokenInHeader : false,
	postSendJson: false,
});