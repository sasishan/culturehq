var  Database  = require('../database/Database')
	,Helpers  = require('../Helpers')
	axios = require('axios')
	;


exports.API_getTest = function(db, userId, params, callback)
{
	return callback(null, {result: 'success'});
}

exports.API_getMyEvents = function(db, userId, params, callback)
{
	if (userId)
	{
		Database.getEvents(db, userId, callback);
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
