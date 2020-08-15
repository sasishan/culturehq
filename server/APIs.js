var 
	//Objects = require('../Objects'),
	Engagement = require('./routes/Engagement'),
	Helpers = require('./Helpers');	

// getProcessor = function(operationType)
// {
// 	switch(operationType)
// 	{
// 		case OpsConfig.ValidOperationsTypes.UpdateJot:
// 			return Jots.Operation_updateJot;

// 		default:
// 			console.log('Processors:getProcessor: Invalid operation type '+ operationType + ' found for processor');
// 			return undefined;
// 	}
// };

getAPIProcessor = function(apiPath)
{
	switch(apiPath)
	{
		case '/api/v1/engagement':
			return Engagement.API_getEngagmentResponses;

		default:
			console.log('Processors:getAPIProcessor: Invalid path: '+ apiPath + ' found for processor');
			return undefined;
	}
};

exports.receiveAPIRequest = function(req, res)
{
	// console.log('eId', req.eId)
	// req.eId = 'XX';
	var valid = Helpers.validateEmployeeId(req, res);

	if (!valid)
	{
		var error = Helpers.logError('No ID', Helpers.ErrorCodes.UNAUTHORIZED);		
		return Helpers.sendErrorResponse(res, error);
	}

	try 
	{
		var APIProcessor = getAPIProcessor(req.route.path);
		if (APIProcessor)
		{
			APIProcessor(req.db, req.eId, req.params, function(error, result)
			{
				if (error)
				{
					// console.log(error);
					Helpers.logError(error);
					return Helpers.sendErrorResponse(res, error);			
				}
				else
				{
					return Helpers.sendResponse(res, result);
				}
			});
		}
		else
		{
			var error = Helpers.logError('No such API', Helpers.ErrorCodes.INTERNAL_ERROR);		
			return Helpers.sendErrorResponse(res, error);			
		}
	}
	catch(e)
	{
		console.log(e);
		var error = Helpers.logError('Error processing API', Helpers.ErrorCodes.INTERNAL_ERROR);		
		return Helpers.sendErrorResponse(res, error);		
	}
};
