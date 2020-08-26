var  Database  = require('../database/Database')
	,Helpers  = require('../Helpers')
	axios = require('axios')
	;

exports.API_get1on1Templates = function(db, userId, params, callback)
{
	if (userId)
	{
		var companyId = params.userProfile.companyId;
		Database.get1on1Templates(db, companyId, {}, function(error, results)
		{
			try
			{
				if (error)
				{
					return callback(error, null);
				}

				return callback(null, results);

			}
			catch (error)
			{
					console.log('error');
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


exports.API_getQuestionBankCultures = function(db, userId, params, callback)
{
	if (userId)
	{
		var companyId = params.userProfile.companyId;
		Database.getQuestionBankCultures(db, companyId, {}, function(error, results)
		{
			try
			{
				if (error)
				{
					return callback(error, null);
				}

				return callback(null, results);

			}
			catch (error)
			{
					console.log('error');
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

exports.API_getQuestionBank = function(db, userId, params, callback)
{
	if (userId)
	{
		var companyId = params.userProfile.companyId;
		Database.getQuestionBank(db, companyId, {}, function(error, results)
		{
			try
			{
				// var data = JSON.parse(resp);
				if (error)
				{
					return callback(error, null);
				}

				return callback(null, results);

			}
			catch (error)
			{
					console.log(error);
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

// exports.API_getQuestionBank = function(db, userId, params, callback)
// {
// 	if (userId)
// 	{

// 		var url = "https://h6oygjk5ci.execute-api.us-west-2.amazonaws.com/default/myCultureQuestions";
// 		if (!params.idToken)
// 		{
// 			return callback({message: 'No authorization', errorCode: 401}, null);	
// 		}

// 		Helpers.callExternalAPI(params.idToken, null, url, function(error, response)
// 		{
// 			if (error)
// 			{
// 				console.log(error);
// 		  		return callback(error, null);
// 			}			
// 			return callback(null, response.data);
// 		});
// 	}
// 	else
// 	{
// 		console.log('Error with id');
// 		return callback('Error with id', null);
// 	}		
// }
