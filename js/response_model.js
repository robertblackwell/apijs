const Backbone = require('backbone');

/**
 * This model holds the latest response from the seerver so that
 * it can be linked to a view that displays a summary in the response-peek
 * area of the screen
 */
const ResponseModel = Backbone.Model.extend({
    defaults : {
        success : true,
        response : null,
    },
})

ResponseModel.prototype.reportFailure = function reportFailure(errorPacket)
{
    this.set({ success : false, response : errorPacket });
}

ResponseModel.prototype.reportSuccess = function reportSuccess(response)
{
    this.set({ success : true, response : response });
}

module.exports = ResponseModel;