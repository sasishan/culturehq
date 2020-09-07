var Config=require('../config.js');

exports.API_ReceiveIncomingMail = function(db, userId, params, callback)
{
//      console.log(params.body.sender, params.body.subject, params.body); 
	// for (var key in params.body) {
	// 	if (params.body.hasOwnProperty(key)) 
	// 	{
	// 	console.log(key + " -> " + params.body[key]);
	// 	}
	// }

	console.log("Body-plain-> ", params.body['body-plain']);
	console.log("Subject-> ", params.body['subject']);
	console.log("Sender-> ", params.body['sender']);

	var response = getResponse(params.body);
	if (response.sender!=NotFound)
	{
		Database.getUserIdCompanyIdFromEmail(db, sender, function(error, results)
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

				Database.logIncomingDailyQuestionAnswer(db, response.questionId, companyId, response.sender, 
					answer, response.emailText, callback);

			}
		});		
	}
	else
	{
		console.log('Unable to parse email response');
	}


	return callback(null, "OK");
}

var NotFound = "not found";
getResponse = function(text)
{
	console.log(text);
	var response = {sender: NotFound, emailAnswer:NotFound, emailText: NotFound, questionId: NotFound};
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
		response.emailAnswer= bodyText.charAt(0); 
	}

	if (text['subject'])
	{
		var subject = text['subject'];	
		response.questionId = getFromBetween(subject, 'Team Survey: ', '-Q');
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