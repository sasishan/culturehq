var Config=require('../config.js');

exports.receiveIncomingMail = function(db, userId, params, callback)
{
	console.log(userId, params);
	return callback(null, "OK");
}