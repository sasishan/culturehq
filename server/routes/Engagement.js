var  Database  = require('../database/Database')
	,Helpers  = require('../Helpers')
	axios = require('axios')
	;

exports.API_getEngagmentResponses = function(db, eId, params, callback)
{
	if (eId)
	{
		var config= {
			headers: { 
				'content-type':'application/json', 
			}
		};		
		var url = "https://b6i15gvzmj.execute-api.us-west-2.amazonaws.com/default/myCultureSurveyResponses";

		axios
		.get(url, config)
		.then(
		  	function(response) 
		  	{ 
		  		// console.log(response.data);
		  		return callback(null, response.data);
		  	}, function(error)
		  	{
		  		console.log(error);
		  		return callback(error, null);
		  	});		

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
