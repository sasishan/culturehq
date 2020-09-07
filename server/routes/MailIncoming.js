var Config=require('../config.js');

exports.API_ReceiveIncomingMail = function(db, userId, params, callback)
{
	console.log(userId, params);
	return callback(null, "OK");
}