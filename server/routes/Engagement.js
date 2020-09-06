var  Database  = require('../database/Database')
	,Helpers  = require('../Helpers')
	,axios = require('axios')
	,Config=require('../config.js')
	,mail = require('./Mail.js')
	
	;

exports.API_getQuestionRecommendations = function(db, userId, params, callback)
{
	if (userId)
	{
		var companyId = params.userProfile.companyId;
		var scores = params.body.scores;
		var questionIds=[];
		var questionScores={};
		for (var i=0; i<scores.length; i++)
		{
			questionIds.push(scores[i].questionId);
			questionScores[scores[i].questionId] = scores[i].score;
		}

		Database.getQuestionRecommendation(db, companyId, questionIds, function(error, results)
		{
			if (error)
			{
				console.log(error);
				return callback(error, null);
			}
			// console.log('API_getQuestionInsights', results);

			if (results.length==0)
			{
				// console.log('no results');
				return callback(null, results);
			}	
			
			var recommendations=[];
			for (var i=0; i< results.length;i++)
			{
				var rec = results[i];
				var newRecommendation = {questionId: rec.questionId, score:score, recommendation:  "No recommendation"};
				if (this.questionScores[rec.questionId]!=undefined)
				{
					var score = this.questionScores[rec.questionId];

					try 
					{
						rec.recommendation = JSON.parse(rec.recommendation);	
						newRecommendation.recommendation = getRecommendation(score, rec.recommendation);	
					}
					catch (e)
					{
						console.log('Error parsing Question #' + rec.questionId, e, rec.recommendation);
						newRecommendation.recommendation ="Error parsing";
					}
					// rec.recommendation = JSON.parse(rec.recommendation);
					

					// recommendations.push({questionId: rec.questionId, score:score, recommendation: rec});
					// console.log(recommendations, rec.questionId);
				}

				recommendations.push(newRecommendation);
			}
			// console.log(recommendations, rec.questionId);
			return callback(null, recommendations);

		}.bind({questionScores:questionScores}));
	}
	else
	{
		console.log('Error with id');
		return callback('Error with id', null);
	}	
}

// [
// 	{
// 		minValue: 0,
// 		maxValue: 1, 
// 		recommendation: "Consider blah blh blah."
// 	},
// 	{
// 		minValue: 1,
// 		maxValue: 3, 
// 		recommendation: "Consider blah blh blah."
// 	},
// 	{
// 		minValue: 3,
// 		maxValue: 5, 
// 		equalTo: 5,
// 		recommendation: "Consider blah blh blah."
// 	},
// 	defaultRecommendation: "Not recommendation found for this score"
// ]	

getRecommendation=function(score, questionRecLogic)
{
	
	for (var i=0; i<questionRecLogic.recommendations.length; i++)
	{
		var rec = questionRecLogic.recommendations[i];
		if (rec.equalTo!=undefined)
		{
			if (score==rec.equalTo)
			{
				return rec.recommendation;
			}	
		}

		// console.log(score, rec.minValue, rec.maxValue);
		if (rec.minValue!=undefined && rec.maxValue!=undefined)
		{
			// console.log(rec.minValue, rec.maxValue, score);
			if (score>=rec.minValue && score<rec.maxValue)
			{
				// console.log(rec.recommendation, score);
				return rec.recommendation;
			}
		}
	}
	return questionRecLogic.defaultRecommendation;
}

exports.API_updateQuestions = function(db, userId, params, callback)
{
	if (userId)
	{
		var questionId = params.params.questionId;
		var question = params.body.question;
		var companyId = params.userProfile.companyId;

		if (questionId==null || question==null || question.question==null || question.answers==null || question.recommendation==null)
		{
			return callback('Missing data ', null);	
		}

		Database.updateQuestionAndRecommendation(db, companyId, questionId, question, function(error, result)
		{
			if (error)
			{
				return callback(error, null);
			}

			return callback(null, "Updated");			
		});
	}
	else
	{
		console.log('Error with id');
		return callback('Error with id', null);
	}	
	
}

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

exports.API_getAllRecommendations = function(db, userId, params, callback)
{
	if (userId) //@todo should be admin
	{
		var companyId = params.userProfile.companyId;
		Database.getAllQuestionRecommendations(db, companyId, function(err, resp)
		{
			try
			{
				if (err)
				{
					return callback(err, null);
				}

				for (var i=0; i<resp.length; i++)
				{
					var r = resp[i];
					r.recommendation = JSON.parse(r.recommendation);
				}
				return callback(null, resp);

			}
			catch (err)
			{
				console.log('Error with recommendations');
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
	}
	else
	{
		console.log('Error with id');
		return callback('Error with id', null);
	}		


}
