var  Database  = require('../database/Database');

exports.API_getMyProfile = function(db, userId, params, callback)
{
	if (userId)
	{
		var companyId = params.userProfile.companyId;
		Database.getMyProfile(db, userId, callback);
	}
	else
	{
		console.log('Error with id');
		return callback('Error with id', null);
	}	
}

exports.API_getAllUsers = function(db, userId, params, callback)
{
	if (userId)
	{
		var companyId = params.userProfile.companyId;
		Database.getAllUsersWithManagers(db, companyId, callback);
	}
	else
	{
		console.log('Error with id');
		return callback('Error with id', null);
	}	
}

exports.API_getMyExtendedManagers = function(db, userId, params, callback)
{
	if (userId)
	{
		Database.getMyExtendedManagers(db, userId, callback);
	}
	else
	{
		console.log('Error with id');
		return callback('Error with id', null);
	}	
}