exports.API_getMyProfile = function(db, userId, params, callback)
{
	if (userId)
	{
		var companyId = params.userProfile.companyId;
		Database.getMyProfile(db, companyId, callback);
	}
	else
	{
		console.log('Error with id');
		return callback('Error with id', null);
	}	
}