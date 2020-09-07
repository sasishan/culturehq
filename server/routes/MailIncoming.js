var Config=require('../config.js'), 
	Database  = require('../database/Database');

exports.API_ReceiveIncomingMail = function(db, userId, params, callback)
{
//      console.log(params.body.sender, params.body.subject, params.body); 
	// for (var key in params.body) {
	// 	if (params.body.hasOwnProperty(key)) 
	// 	{
	// 	console.log(key + " -> " + params.body[key]);
	// 	}
	// }

	console.log(params);
	console.log("Body-plain-> ", params.body['body-plain']);
	console.log("Subject-> ", params.body['subject']);
	console.log("Sender-> ", params.body['sender']);

	try 
	{
		var response = getResponse(params.body);
		if (response.sender!=NotFound)
		{
			Database.getUserIdCompanyIdFromEmail(db, response.sender, function(error, results)
			{
				if (error)
				{
					console.log(error);
					return callback(error, null);
				}

				console.log(results);
				if (results.length>0)
				{
					var profile = results[0];
					var companyId = profile.companyId;
					if (companyId==undefined)
					{
						return callback("Sender is not valid: " + response.sender, null);
					}						
					else
					{
						Database.logIncomingDailyQuestionAnswer(db, response.questionId, companyId, response.sender, 
							response.answer, response.emailText, callback);
					}


				}
			});		
		}
		else
		{
			console.log('Unable to parse email response');
		}
	}
	catch(e)
	{
		console.log(e);
		return callback("Internal error", null);
	}
}

var NotFound = "not found";
getResponse = function(text)
{
	console.log(text);
	var response = {sender: NotFound, answer:NotFound, emailText: NotFound, questionId: NotFound};
	// var sender="not found";
	// var emailAnswer = "not found";
	// var mailResponse = "not found";
	// var subject="not found";
	// var questionId = "not found";
	if (text['sender'])
	{
		response.sender = text['sender'];	
	}
	
	if (text['body-plain'])
	{
		var bodyText = text['body-plain'];	
		response.emailText = bodyText;
		response.answer= bodyText.charAt(0); 
	}

	if (text['subject'])
	{
		var subject = text['subject'];	
		try
		{
			response.questionId = parseInt(getFromBetween(subject, 'Team Survey: ', '-Q'));	
		}
		catch (e)
		{
			console.log('Parse error-> ', e);
		}
	}	

	console.log('response', response);
	return response;
}

getFromBetween = function (string, sub1, sub2) 
{
    if(string.indexOf(sub1) < 0 || string.indexOf(sub2) < 0) return false;
    var SP = string.indexOf(sub1)+sub1.length;
    var string1 = string.substr(0,SP);
    var string2 = string.substr(SP);
    var TP = string1.length + string2.indexOf(sub2);
    return string.substring(SP,TP);
}