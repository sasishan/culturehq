// var ObjectId = require('mongodb').ObjectID;

var Tables={};
Tables.DailyQuestions = "DailyQuestions";
Tables.Events = "Events";
exports.Tables = Tables;

exports.getUserProfile = function(db, userId, callback)
{
	var query = "select * from Users where userId='" + userId+"'";
	return runQuery(db, query, callback);
}	

exports.getEvents = function(db, userId, callback)
{
	var query = "select * from " + Tables.Events + " where userId='" + userId+"'";
	return runQuery(db, query, callback);
}	

exports.getDailyQuestions = function(db, companyId, callback)
{
	var query = "select * from " + Tables.DailyQuestions + " where companyId='" + companyId+"'";
	return runQuery(db, query, callback);
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