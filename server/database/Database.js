// var ObjectId = require('mongodb').ObjectID;
var mysql = require('mysql');
var Tables={};
Tables.DailyQuestions = "DailyQuestions";
Tables.Events = "Events";
exports.Tables = Tables;

exports.getMyManagers=function(db, userId, callback)
{
	var managerId = mysql.escape(userId);
	var query = 
	`with recursive cte (managerId, reportId, depth) as ( 
		select     managerId, reportId, 0 as depth
		from       DirectReports
		where      managerId = ${managerId}
		union all
		select     child.managerId, child.reportId, cte.depth+1
		from       DirectReports child
		inner join cte
			on child.managerId = cte.reportId
	) 
	select distinct managerId as userId, M.fName as managerFName, M.lName as managerLName, depth 
		from cte, Users U, Users M
		where U.userId=reportId AND managerId=M.userId AND managerId!=${managerId}`;

	// console.log(userId, questionId, companyId, toEmail, dateSent);
	return runQuery(db, query, function(error, result)
	{
		if (error)
		{
			return callback(error, null);
		}

		var data = JSON.parse(result);
		return callback(null, data);
	});
}

exports.getMyReports=function(db, userId, callback)
{
	var managerId = mysql.escape(userId);
	var query = 
	`with recursive cte (managerId, reportId, depth) as ( 
		select     managerId, reportId, 0 as depth
		from       DirectReports
		where      managerId = ${managerId}
		union all
		select     child.managerId, child.reportId, cte.depth+1
		from       DirectReports child
		inner join cte
			on child.managerId = cte.reportId
	) 
	select managerId, M.fName as managerFName, M.lName as managerLName, reportId, U.fName as reportFName, U.lName as reportLName, depth 
		from cte, Users U, Users M
		where U.userId=reportId AND managerId=M.userId`;

	// console.log(userId, questionId, companyId, toEmail, dateSent);
	return runQuery(db, query, function(error, result)
	{
		if (error)
		{
			return callback(error, null);
		}

		var data = JSON.parse(result);
		return callback(null, data);
	});
}

exports.getResponsesByManagers= function(db, companyId, managerIdArray, callback)
{

}

exports.updateQuestionAndRecommendation = function(db, companyId, questionId, question, callback)
{
	var answers=JSON.stringify(question.answers);
	var query = `UPDATE DailyQuestions D
				SET question='${question.question}', answers='${answers}' 
				where D.questionId =${questionId} AND D.companyId=${companyId}`;

	runQuery(db, query, function(error, result)
	{
		if (error)
		{
			return callback(error, null);
		}

		var rec= mysql.escape(JSON.stringify(question.recommendation));
		query = `REPLACE INTO DailyQuestions_Recommendations (questionId, Recommendation) VALUES(${questionId}, ${rec})`
		// query = `UPDATE DailyQuestions_Recommendations D
		// 		SET Recommendation='${rec}' 
		// 		where D.questionId =${questionId}`;		

		runQuery(db, query, function(error, result)
		{
			query = `delete from mapping_DailyQuestions_Cultures where questionId=${questionId}`;
			runQuery(db, query, function(error, result)
			{	
				var q="";
				for (var i=0; i< question.cultures.length; i++)
				{
					var culture = question.cultures[i];
					q +=`insert into mapping_DailyQuestions_Cultures values('${questionId}', '${culture.cultureId}');`;
				}	

				runQuery(db, q, function(error, result)
				{
					if (error)
					{
						return callback(error, null);
					}
				});

			});
			
		});

	
		
	});
}

exports.getAllQuestionRecommendations=function(db, companyId, callback)
{
	var query = `SELECT D.questionId, recommendation 
				FROM cultureHQ.DailyQuestions_Recommendations R, DailyQuestions D
				where R.questionId = D.questionId AND D.companyId=${companyId}`;


	// console.log(userId, questionId, companyId, toEmail, dateSent);
	return runQuery(db, query, function(error, result)
	{
		if (error)
		{
			return callback(error, null);
		}

		try
		{
			var data = JSON.parse(result);
			return callback(null, data);	
		}
		catch (e)
		{
			console.log(e, result);
			return callback('error parsing', null);	
		}
		
	});
}

exports.getQuestionRecommendation=function(db, companyId, questionIds, callback)
{
	var query = `SELECT D.questionId, recommendation 
				FROM cultureHQ.DailyQuestions_Recommendations R, DailyQuestions D
				where R.questionId = D.questionId AND D.publish='Y' AND D.questionId in (${questionIds}) AND D.companyId=${companyId}`;


	// console.log(userId, questionId, companyId, toEmail, dateSent);
	return runQuery(db, query, function(error, result)
	{
		if (error)
		{
			return callback(error, null);
		}

		try
		{
			var data = JSON.parse(result);
			return callback(null, data);	
		}
		catch (e)
		{
			console.log(e, result);
			return callback('error parsing', null);	
		}
		
	});
}

exports.getDailyEmailsList=function(db, callback)
{
	var query = "SELECT * FROM cultureHQ.DailyEmailLists";

	// console.log(userId, questionId, companyId, toEmail, dateSent);
	return runQuery(db, query, function(error, result)
	{
		if (error)
		{
			return callback(error, null);
		}

		var data = JSON.parse(result);
		return callback(null, data);
	});
}

exports.getNextDailyQuestionId = function(db, companyId, callback)
{
	var query = `SELECT MIN(questionId) questionId FROM cultureHQ.DailyQuestions D 
	WHERE D.state='readytosend' and D.companyId=${companyId}`;

	// console.log(userId, questionId, companyId, toEmail, dateSent);
	return runQuery(db, query, function(error, result)
	{
		if (error)
		{
			return callback(error, null);
		}

		var data =[];

		if (result.length>0)
		{
			data = JSON.parse(result);
			// console.log('getNextDailyQuestionId', data);
		}
		
		return callback(null, data);
	});
}


exports.getManagerIdUserIdCompanyIdFromEmail = function(db, email, callback)
{
	
	var date = (new Date()).toISOString();
	email = mysql.escape(email);

	var query = `select D.managerId, U.userId, U.companyId from Users U, DirectReports D where email=${email} AND U.userId=D.reportId`;

	// console.log(userId, questionId, companyId, toEmail, dateSent);
	return runQuery(db, query, function(error, result)
	{
		if (error)
		{
			return callback(error, null);
		}		
		var result = JSON.parse(result);
		return callback(null, result);
	});
}

exports.logIncomingDailyQuestionAnswer = function(db, questionId, companyId, senderId, senderEmail, answer, emailText, callback)
{
	var date = (new Date()).toISOString();
	senderEmail = mysql.escape(senderEmail);
	answer = mysql.escape(answer);
	emailText = mysql.escape(emailText);
	senderId = mysql.escape(senderId);

	var query = `replace into DailyQuestions_Answers (companyId, questionId, userId, senderEmail, answer, emailText, dateReceived) 
				values( ${companyId}, ${questionId}, ${senderId}, ${senderEmail}, ${answer}, ${emailText}, '${date}')`;

	// console.log(userId, questionId, companyId, toEmail, dateSent);
	return runQuery(db, query, callback);
}

exports.logSentEmail = function(db, userId, questionId, companyId, toEmail, callback)
{
	
	var dateSent = (new Date()).toISOString();

	var query = `insert into Log_DailyQuestionEmailsSent (userId, questionId, companyId, dateSent, toEmail) 
				values( '${userId}', ${questionId}, ${companyId}, '${dateSent}', '${toEmail}')`;

	// console.log(userId, questionId, companyId, toEmail, dateSent);
	return runQuery(db, query, callback);
}

exports.getSendLogs = function(db, companyId, callback)
{
	var query = `SELECT L.id, D.questionId, D.question, L.dateSent, L.toEmail FROM Log_DailyQuestionEmailsSent L, DailyQuestions D 
		where L.questionId = D.questionId and L.companyId=${companyId} order by L.dateSent DESC`;

	return runQuery(db, query, callback);
}

exports.getUserProfile = function(db, userId, callback)
{
	var query = "select * from Users where userId='" + userId+"'";
	return runQuery(db, query, callback);
}	

exports.getMyProfile = function(db, userId, callback)
{
	var query = "select fName, lName, email, profileImage from Users where userId='" + userId+"'";
	return runQuery(db, query, callback);
}	

exports.getEvents = function(db, userId, callback)
{
	var query = "select * from " + Tables.Events + " where userId='" + userId+"'";
	return runQuery(db, query, callback);
}	

exports.setQuestionLastSent = function(db, questionId, callback)
{
	var lastSent = (new Date).toISOString();
	var query = `UPDATE DailyQuestions SET lastSent='${lastSent}', state='sent' WHERE questionId=${questionId}`;
	return runQuery(db, query, callback);
}	

exports.setQuestionPublish = function(db, questionId, companyId, isPublished, callback)
{
	var lastSent = (new Date).toLocaleDateString();
	var publish='N';
	if (isPublished)
	{
		publish='Y';
	}
	var query = `UPDATE DailyQuestions SET publish='${publish}' WHERE questionId=${questionId}`;
	return runQuery(db, query, callback);
}	

exports.createNewQuestion = function(db, companyId, newQuestion, callback)
{
	newQuestion.answers = JSON.stringify(newQuestion.answers);
	var query = `insert into cultureHQ.DailyQuestions (question, answers, companyId, publish) 
				values('${newQuestion.question}', '${newQuestion.answers}', ${companyId}, 'N' )`;
	console.log(newQuestion);
	runQuery(db, query, function(error, result)
	{
		if (error)
		{
			return callback(error, null);
		}

		var result = JSON.parse(result);
		var questionId = result.insertId;
		// console.log(result, questionId);
		for (var i=0; i< newQuestion.cultures.length; i++)
		{
			var culture = newQuestion.cultures[i];
			query = `insert into mapping_DailyQuestions_Cultures values('${questionId}', '${culture.cultureId}')`;

			runQuery(db, query, function(error, result)
			{
				if (error)
				{
					return callback(error, null);
				}
			});
		}
		return callback(null, questionId);
	});
}	


exports.getOneDailyQuestion = function(db, questionId, companyId, callback)
{
	var query = "SELECT D.questionId, D.question, D.answers, C.name as culture \
				FROM DailyQuestions D, mapping_DailyQuestions_Cultures M, Cultures C  \
				where D.questionId="+questionId+ " \
				and D.questionId=M.questionId \
				and C.cultureId=M.cultureId \
				and D.companyId="+companyId;

	// "select * from " + Tables.DailyQuestions + " where companyId='" + companyId+"'";
	return runQuery(db, query, function(error, result)
	{
		if (error)
		{
			console.log('Error running query: ' + query);
			return callback(error, null);
		}

		var tempTemplate={};
		var templates=[];

		var data = JSON.parse(result);
		for (var i=0; i<data.length;i++)
		{
			
			var t = data[i];

			t.answers = JSON.parse(t.answers);
			if (tempTemplate[t.questionId]==undefined)
			{
				tempTemplate[t.questionId] = 
				{ 
					questionId: t.questionId, 
					question: t.question,
					answers: t.answers,
					cultures: []
				};					
				templates.push(tempTemplate[t.questionId]);
			}
			
			tempTemplate[t.questionId].cultures.push({cultureId: t.cultureId, culture: t.culture});	
		}		

		return callback(null, templates);
	});
}



exports.getDailyQuestions = function(db, companyId, onlyPublished=true, callback)
{
	var publish=" AND D.publish = 'Y' ";

	var query = "SELECT D.questionId, D.question, D.answers, D.publish, C.name as culture, C.cultureId, D.lastSent \
				FROM DailyQuestions D, mapping_DailyQuestions_Cultures M, Cultures C \
				where D.questionId=M.questionId and C.cultureId=M.cultureId and D.companyId="+companyId;

	if (onlyPublished==true)
	{
		query+=publish;
	}

	query+=" ORDER BY D.questionId DESC"
	// "select * from " + Tables.DailyQuestions + " where companyId='" + companyId+"'";
	return runQuery(db, query, function(error, result)
	{
		if (error)
		{
			console.log('Error running query: ' + query);
			return callback(error, null);
		}

		var tempTemplate={};
		var templates=[];

		var data = JSON.parse(result);
		for (var i=0; i<data.length;i++)
		{
			
			var t = data[i];

			t.answers = JSON.parse(t.answers);
			if (tempTemplate[t.questionId]==undefined)
			{
				tempTemplate[t.questionId] = 
				{ 
					questionId: t.questionId, 
					question: t.question,
					answers: t.answers,
					lastSent: t.lastSent,
					publish: t.publish,
					cultures: []
				};					
				templates.push(tempTemplate[t.questionId]);
			}
			
			tempTemplate[t.questionId].cultures.push({cultureId: t.cultureId, culture: t.culture});	
		}		

		return callback(null, templates);
	});
}	

exports.getQuestionBankCultures  = function(db, companyId, params, callback)
{
	var query = "select * from Cultures";
	return runQuery(db, query, callback);
}	

exports.get1on1Templates = function(db, companyId, params, callback)
{
	// var query = "select * from " + Tables.DailyQuestions + " where companyId='" + companyId+"'";

	var query = "select T.templateId, T.title, T.description, C.categoryId, C.name, C.description as categoryDescription, C.type as categoryType, M.categoryOrder\
	from Templates1on1 T, mapping_Templates1on1_Categories M, QuestionCustomCategories C \
	where \
	T.templateId=M.templateId \
	AND M.categoryId = C.categoryId \
	ORDER BY T.templateId, M.categoryOrder";

	return runQuery(db, query, function(error, result)
	{
		if (error)
		{
			console.log('Error running query: ' + query);
			return callback(error, null);
		}

		var tempTemplate={};
		var templates=[];
		var data = JSON.parse(result);
		for (var i=0; i<data.length;i++)
		{
			var t = data[i];
			if (tempTemplate[t.templateId]==undefined)
			{
				tempTemplate[t.templateId] = { templateId: t.templateId, title: t.title, description: t.description, questionCategories: []};					
				templates.push(tempTemplate[t.templateId]);
			}
			tempTemplate[t.templateId].questionCategories.push(
				{categoryId: t.categoryId, name: t.name, description : t.description, categoryOrder: t.categoryOrder, description : t.categoryDescription, type: t.categoryType});
		}		

		return callback(null, templates);
	});
}	

exports.getQuestionBank = function(db, companyId, params, callback)
{
	// var query = "select * from " + Tables.DailyQuestions + " where companyId='" + companyId+"'";

	var query = "select Q.questionId as questionId, Q.question as Question, C.name as Category, C.type \
	from QuestionBank1on1 Q, Cultures C, mapping_QuestionBank_Cultures M \
	where (Q.questionId = M.questionId AND C.cultureId=M.cultureId) \
	UNION \
	select Q.questionId as questionId, Q.question, C.name, C.type \
	from QuestionBank1on1 Q, QuestionCustomCategories C, mapping_QuestionBank_CustomCategories M \
	where (Q.questionId = M.questionId AND M.categoryId=C.categoryId AND C.CompanyId="+companyId+") \
	ORDER BY questionId";

	return runQuery(db, query, function(error, result)
	{
		if (error)
		{
			console.log('Error running query: ' + query);
			return callback(error, null);
		}

		var tempQuestionBank={};
		var questionBank=[];
		var data = JSON.parse(result);
		for (var i=0; i<data.length;i++)
		{
			var q = data[i];
			if (tempQuestionBank[q.questionId]==undefined)
			{
				tempQuestionBank[q.questionId] = { questionId: q.questionId, question: q.Question, categories: [], cultures: [] };	
				questionBank.push(tempQuestionBank[q.questionId]);
			}
			if (q.type=='culture')
			{
				tempQuestionBank[q.questionId].cultures.push(q.Category);
			}
			else
			{
				tempQuestionBank[q.questionId].categories.push(q.Category);	
			}
			
		}		

		return callback(null, questionBank);
	});
}	



runQuery = function(db, query, callback)
{
	if (!db)
	{
		console.log('runQuery: DB not connected');
		return callback('error in DB', null);
	}

	try
	{
		console.log(query);
		db.query(query, function(error, rows)
		{
			if (error)
			{
				console.log(error);
				// throw error;
				return callback(error, null);
			} 

			return callback(null, JSON.stringify(rows));

		});	
	}
	catch (error)
	{
		console.log(error);
		return callback(error, null);
	}

}