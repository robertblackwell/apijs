
const RestBase = require('./js/managers/mixins/rest_base');
const RestRaw = require('./js/managers/mixins/rest_raw');
const RestUser = require('./js/managers/mixins/rest_user');
const RestDev = require('./js/managers/mixins/rest_dev');
const RestApi = require('./js/managers/rest_manager');

const RpcBase = require('./js/managers/mixins/rpc_base');
const RpcRaw = require('./js/managers/mixins/rpc_raw');
const RpcUser = require('./js/managers/mixins/rpc_user');
const RpcDev = require('./js/managers/mixins/rpc_dev');
const RpcApi = require('./js/managers/rpc_manager');

const JqueryRequest = require('./js/managers/jquery_request_manager'); 

const Configuration = require('./js/configuration');


const Rest = {
	Base : RestBase,
	Raw : RestRaw,
	User : RestUser,
	Dev : RestDev,
	Api : RestApi
}

const Rpc = {
	Base : RpcBase,
	Raw : RpcRaw,
	User : RpcUser,
	Dev : RpcDev,
	Api : RpcApi
}

module.exports = {
	Rest : Rest,
	Rpc : Rpc,
	Configuration : Configuration,
	JqueryRequest : JqueryRequest,
}