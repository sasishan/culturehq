var  Database  = require('../database/Database')
	,Helpers  = require('../Helpers')
	,axios = require('axios')
	,Config=require('../config.js')
	;

exports.API_getEngagementDailyQuestions = function(db, userId, params, callback)
{
	if (userId)
	{
		var companyId = params.userProfile.companyId;
		Database.getDailyQuestions(db, companyId, function(err, resp)
		{
			try
			{
				response = JSON.parse(resp);
				for (var i=0; i<response.length;i++)
				{
					response[i].answers = JSON.parse(response[i].answers);
					response[i].cultures = JSON.parse(response[i].cultures);
				}

				callback(null, response);

			}
			catch (error)
			{
					console.log('Error parsing the question');
					return callback('Error parsing', null);				
			}

		});
	}
	else
	{
		console.log('Error with id');
		return callback('Error with id', null);
	}	
}

exports.API_getEngagmentResponses = function(db, userId, params, callback)
{
	if (userId)
	{

		var url = "https://uxjgruud9i.execute-api.us-west-2.amazonaws.com/default/myCultureSurveyResponses";
		if (!params.idToken)
		{
			return callback({message: 'No authorization', errorCode: 401}, null);	
		}

		var apiKey=Config.API_KEY_1;
		Helpers.callExternalAPI(null, apiKey, url, function(error, response)
		{
			if (error)
			{
				console.log(error);
		  		return callback(error, null);
			}			
			return callback(null, response.data);
		});


		// var config= {
		// 	headers: { 
		// 		'content-type':'application/json', 
		// 	}
		// };		
		// var url = "https://b6i15gvzmj.execute-api.us-west-2.amazonaws.com/default/myCultureSurveyResponses";

		// axios
		// .get(url, config)
		// .then(
		//   	function(response) 
		//   	{ 
		//   		// console.log(response.data);
		//   		return callback(null, response.data);
		//   	}, function(error)
		//   	{
		//   		console.log(error);
		//   		return callback(error, null);
		//   	});		

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
