// var ObjectId = require('mongodb').ObjectID;

var Tables={};
Tables.Sections = "Sections";
Tables.Events = "Events";
exports.Tables = Tables;

exports.getEvents = function(db, eId, options, callback)
{
	var query = "select * from " + Tables.Events + " where userId=" + eId;
	return runQuery(db, query, callback);
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
		db.query(query, function(error, rows)
		{
			if (error)
			{
				console.log(error);
				throw error;
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