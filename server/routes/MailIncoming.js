var Config=require('../config.js');

exports.API_ReceiveIncomingMail = function(db, userId, params, callback)
{
	console.log(params.body.sender, params.body.subject, params.body.body-plain);
	return callback(null, "OK");
}