var  Database  = require('../database/Database')
	,Helpers  = require('../Helpers')
	,axios = require('axios')
	,Config=require('../config.js')
	,mail = require('./Mail.js')
	;

exports.API_getSendLogs = function(db, userId, params, callback)
{
	if (userId)
	{
		var companyId = params.userProfile.companyId;
		Database.getSendLogs(db, companyId, callback);
	}
	else
	{
		console.log('Error with id');
		return callback('Error with id', null);
	}	
}

exports.API_publishDailyQuestion= function(db, userId, params, callback)
{
	if (userId)
	{
		var questionId = params.params.questionId;
		var publish = params.body.publish;
		var companyId = params.userProfile.companyId;

		if (publish==null)
		{
			return callback('Missing data ', null);	
		}

		// newQuestion.answers = JSON.stringify(newQuestion.answers);
		var isPublished = true;
		if (publish=='N')
		{
			isPublished= false;
		}

		Database.setQuestionPublish(db, questionId, companyId, isPublished, function(error, results)
		{
			if (error)
			{
				return callback(error, null);
			}

			return callback(null, "Created");
		});

	}
	else
	{
		return callback('Missing user id', null);	
	}	
};

exports.API_newQuestion = function(db, userId, params, callback)
{
	if (userId)
	{
		var newQuestion = params.body.question;
		var companyId = params.userProfile.companyId;
		if (newQuestion.question==null || newQuestion.answers==null || newQuestion.publish==null)
		{
			return callback('Missing data ', null);	
		}

		// newQuestion.answers = JSON.stringify(newQuestion.answers);

		Database.createNewQuestion(db, companyId, newQuestion, function(error, result)
		{
			if (error)
			{
				return callback(error, null);
			}

			return callback(null, "Created");
		});

	}
	else
	{
		return callback('Missing user id', null);	
	}	
};

exports.runDailySurveyQuestion = function(db, callback)
{
	var emails={};
	var companyIds=[];

	Database.getDailyEmailsList(db, function(error, results)
	{
		for (var i=0; i<results.length; i++)
		{
			var companyId = results[i].companyId;
			if (emails[companyId]==undefined)
			{
				emails[companyId]=[];
				companyIds.push(companyId);
			}
			emails[companyId].push(results[i].email);
			
		}

		for (var j=0; j<companyIds.length; j++)
		{
			var companyId = companyIds[j];

			Database.getNextDailyQuestionId(db, companyId, function(error, result)
			{
				if (error)
				{
					console.log(error);
					callback(error, null);
				}

				var questionId=-1;
				if (result.length>0 && result[0].questionId!=null)
				{
					questionId = result[0].questionId;	

					// console.log('ready to send', this.companyId, questionId, this.emails);
					sendSurveyEmail(db, 'Robot', this.companyId, questionId, this.emails, function(error, result)
					{
						if (error)
						{
							console.log(error);
							// return callback(error, null);
						}		
							
						Database.setQuestionLastSent(db, this.questionId, function(error, results)
						{
							if (error)
							{
								console.log(error);
							}
						});						
					}.bind({questionId: questionId}));					
				}
				else
				{
					console.log('No questions to send for companyId: ', companyId);
				}

			}.bind({companyId: companyId, emails: emails[companyId]}));
		}

		if (error)
		{
			console.log(error);
			return callback(error, null);
		}

		return callback(null, 'OK');
	});


}

exports.API_sendOneSurveyQuestion = function(db, userId, params, callback)
{
	if (userId)
	{
		var companyId = params.userProfile.companyId;
		var body  = params.body;
		var questionId=null;
		var emails=[];
		if (body.questionId && body.emails)
		{
			for (var i=0; i<body.emails.length; i++)
			{
				emails.push(body.emails[i].trim());
			}

			questionId = body.questionId;
			if (emails.length>0)
			{
				sendSurveyEmail(db, userId, companyId, questionId, emails, callback);
			}
			else
			{
				return callback('No emails provided', null);			
			}
			
		}
		else
		{
			return callback('Missing data', null);	
		}
	}
	else
	{
		console.log('Error with id');
		return callback('Error with id', null);
	}	
}

sendSurveyEmail = function(db, userId, companyId, questionId, emails, callback)
{
	Database.getOneDailyQuestion(db, questionId, companyId, function(err, question)
	{
		try
		{
			if (err)
			{
				return callback(err, null);
			}

			var question = question[0];
			var today = (new Date()).toLocaleDateString();
			var subject = Config.SurveyEmailSubject + today;

			var answerOptions = question.answers;
			var qId = question.questionId;
			var q = question.question;

			var message = `Hi there! <p>This is your daily Company survey question.</p><p> \
			To respond, please click the letter of your choice below and send the auto-generated email.</p><p> \
			<b>Question: ${q}</b></p><p><ul>`;

			// console.log(answerOptions);
			for (var i=0; i<answerOptions.options.length;i++)
			{
				var optionLetter = (answerOptions.options[i].answer).toUpperCase();
				var answerText = answerOptions.options[i].text;
				var text =`<li><a href="mailto:survey@mail.honchohq.com?subject=Daily%20Team%20Survey:%20${qId}-Q\
	    		&body=${optionLetter}%20%20%0D%0APlease%20do%20not%20modify%20this%20email%20as%20it%20goes%20to%20an%20automated%20system.">\
	    		${optionLetter}. ${answerText}</a></li></br>`;
	    		message +=text;
			}
    		
    		message+="</ul></p>";
    		console.log(emails)
			for (var j=0; j<emails.length;j++)
			{
				var toEmail = emails[j];
				// console.log(toEmail, question);
				mail.API_sendMail(Config.CultureHQSurveyEmail, toEmail, subject, message, function(error, result)
				{
					//do nothing
					if (error)
					{
						console.log(error);
					}
				});

				Database.logSentEmail(db, userId, questionId, companyId, toEmail, function(error, result)
				{
					//do nothing
					if (error)
					{
						console.log(error);
					}
				});				
			}
			
			return callback(null, 'OK');

		}
		catch (err)
		{
			console.log('Error sending questions');
			return callback(err, null);				
		}

	});	
}

exports.API_getEngagementDailyQuestionsPublished = function(db, userId, params, callback)
{
	if (userId)
	{
		var companyId = params.userProfile.companyId;
		Database.getDailyQuestions(db, companyId, true, function(err, resp)
		{
			try
			{
				if (err)
				{
					return callback(err, null);
				}
				return callback(null, resp);

			}
			catch (err)
			{
				console.log('Error with daily questions');
				return callback(err, null);				
			}

		});
	}
	else
	{
		console.log('Error with id');
		return callback('Error with id', null);
	}	
}


exports.API_getEngagementDailyQuestions = function(db, userId, params, callback)
{
	if (userId)
	{
		var companyId = params.userProfile.companyId;
		Database.getDailyQuestions(db, companyId, false, function(err, resp)
		{
			try
			{
				if (err)
				{
					return callback(err, null);
				}
				return callback(null, resp);

			}
			catch (err)
			{
				console.log('Error with daily questions');
				return callback(err, null);				
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
