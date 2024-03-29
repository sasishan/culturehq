var 
	//Objects = require('../Objects'),
	Schedule = require('./routes/Schedule'),
	Engagement = require('./routes/Engagement'),
	OneOnOnes = require('./routes/OneOnOnes'),
	MailIncoming = require('./routes/MailIncoming'),
	Users = require('./routes/Users'),
	Helpers = require('./Helpers');	

getAPIProcessor = function(apiPath)
{
	console.log('api call--> ' + apiPath)
	switch(apiPath)
	{		
		case '/api/v1/myprofile':
			return Users.API_getMyProfile;

		case '/api/v1/myprofile/allmanagers':
			return Users.API_getMyExtendedManagers;

		case '/api/v1/emails/incoming':
			return MailIncoming.API_ReceiveIncomingMail

		case '/api/v1/engagement/recommendations/question':
			return Engagement.API_getQuestionRecommendations;

		case '/api/v1/engagement/recommendations':
			return Engagement.API_getAllRecommendations			

		case '/api/v1/engagement/responses':
			return Engagement.API_getEngagmentResponses2;

		case '/api/v1/engagement/dailyquestions':
			return Engagement.API_getEngagementDailyQuestions;

		case '/api/v1/engagement/publishedquestions':
			return Engagement.API_getEngagementDailyQuestionsPublished;		

		case '/api/v1/engagement/dailyquestion/:questionId/update':
			return Engagement.API_updateQuestions;		

		case '/api/v1/engagement/sendlogs':
			return Engagement.API_getSendLogs;

		case '/api/v1/engagement/newquestion':
			return Engagement.API_newQuestion;

		case '/api/v1/engagement/:questionId/publish':
			return Engagement.API_publishDailyQuestion;

		case '/api/v1/engagement/sendonequestion':
			return Engagement.API_sendOneSurveyQuestion;

		case '/api/v1/events':
			return Schedule.API_getMyEvents;

		case '/api/v1/oneonone/questionbank':
			return OneOnOnes.API_getQuestionBank;

		case '/api/v1/oneonone/questionbank/categories':
			return OneOnOnes.API_getQuestionBankCultures;

		case '/api/v1/oneonone/templates':
			return OneOnOnes.API_get1on1Templates;		

		case '/api/v1/admin/users':
			return Users.API_getAllUsers;	

		default:
			console.log('Processors:getAPIProcessor: Invalid path: '+ apiPath + ' found for processor');
			return undefined;
	}
};

exports.receiveAPIRequest = function(req, res)
{
	// console.log('eId', req.eId)
	// req.eId = 'XX';
	var valid = Helpers.validateUserId(req, res);

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
			APIProcessor(req.db, req.userId, { params: req.params, body: req.body, idToken: req.idToken, userProfile: req.userProfile }, function(error, result)
			{
				if (error)
				{
					console.log('receiveAPIRequest Error: ', JSON.stringify(error));
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
