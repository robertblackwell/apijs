const $ = require('jquery');

const _ = require('underscore');

function ErrorPacket()
{
    this.errorType = '';
    this.errorDetails = {};
    this.httpStatus = '';
    this.httpStatusText = '';
    this.errorStatus = '';
    this.errorThrown = '';
    this.xhr = {};
}
//
// This is going to be a singleton
//
function ErrorManager()
{
    this.reportError = function reportError(ePacket)
    {
        if (ePacket.error_type === 'app')
        {
            this.reportAppError(ePacket);
        }
        else
		{
            this.reportHttpError(ePacket.xhr, ePacket.errorStatus, ePacket.errorThrown);
        }
    };
	//
	// An application error consists of an error code a message and possibly supporting data
	//
    this.reportAppError = function reportAppError(errorPacket)
    {
        const tmp = '<div>'
					+ '<p> errorType 	: <%= errorType %></p>'
					+ '<p> httpStatus 	: <%= httpStatus %></p>'
					+ '<p> httpStatusText: <%= httpStatusText %></p>'
					+ '<p> errorStatus 	: <%= errorStatus %></p>'
					+ '<p> errorThrown 	: <%= errorThrown %></p>'
					+ '<p> errorDetails	: <%= errorDetails %></p>'
					+ '<p> xhr 			: <%= xhr %></p>'
					+ '<hr/>'
				+ '</div>';

        const errorType = errorPacket.errorType;
        const httpStatus = errorPacket.httpStatus;
        const httpStatusText = errorPacket.httpStatusText;
        const errorStatus = errorPacket.errorStatus;
        const errorThrown = errorPacket.errorThrown;
        const errorDetails = JSON.stringify(errorPacket.errorDetails);
        const xhr = JSON.stringify(errorPacket.xhr);
        const attrs = {
            errorType : errorType,
            httpStatus : httpStatus,
            httpStatusText : httpStatusText,
            errorStatus : errorStatus,
            errorThrown : errorThrown,
            errorDetails : errorDetails,
            xhr : xhr,
        };

        const rt = _.template(tmp)(attrs);

        const $t = $(rt);

        $t.css('width', '960px');
        $t.css('overflow', 'scroll');
        $t.dialog({
            title : `Application error [ status:${httpStatus} ]`,
            width : 'auto',
            height : '300',
        });
    };

    this.createErrorPacket = function createErrorPacket(xhr, errorStatus, errorThrown)
	{
        const r = new ErrorPacket();

        r.httpStatus = xhr.status;
        r.httpStatusText = xhr.statusText;
        r.errorStatus = errorStatus;
        r.errorThrown = errorThrown;
        r.xhr = xhr;
        /**
         * NOTE : still using the Slim exception and error handlers hence
         * do not have the ability to send a jsonrpc response for exceptions
         * and php7 errors. Rely on the format of the Slim error handler
         */
        if (xhr.responseJSON !== undefined)
		{
            if (xhr.responseJSON.error !== undefined)
			{
                r.errorType = 'application';
            }
            else if (xhr.responseJSON.exception !== undefined)
			{
                r.errorType = 'exception';
            }
            else if (xhr.responseJSON.error !== undefined)
			{
                r.errorType = 'php_error';
            }
            else
			{
                r.errorType = 'error_unknown';
            }
            r.errorDetails = xhr.responseJSON;
        }
        else
		{
            r.errorType = 'non_json_reply';
            r.errorDetails = xhr.responseText;
            if (xhr.status === 0)
            {
                r.errorType = "Network or CORS"
                r.errorDetails = { 
                    msg : "There was either a network error or a CORS error see javascript console"
                }
            }
        }

        return r;
    };
}

const errorManager  = new ErrorManager();

module.exports = errorManager;
