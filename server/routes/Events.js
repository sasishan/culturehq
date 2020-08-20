var  Database  = require('../database/Database')
	,Helpers  = require('../Helpers')
	axios = require('axios')
	;

exports.API_getMyEvents = function(db, eId, params, callback)
{
	if (eId)
	{
		Database.getEvents(db, eId, {}, callback);
		// Database.GetQuery(db, Database.Tables.Teams, findQuery, options, function(error, results)
		// {
		// 	if (error)
		// 	{
		// 		console.log(error);
		// 		return callback(error, null);
		// 	}

		// 	return callback(null, results);
		// });
	}
	else
	{
		console.log('Error with id');
		return callback('Error with id', null);
	}		
}
