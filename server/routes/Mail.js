var Config=require('../config.js');
var api_key=Config.mail_api_key;
var domain = Config.mail_domain;
var mailgun = require('mailgun-js') ({apiKey: api_key, domain: domain});

exports.sendTestMail = function(toEmail, message)
{
	var data = {
	  from: 'Honcho Test <honchohq_test@mail.honchohq.com>',
	  to: toEmail,
	  subject: 'Test Mail',
	  html: message
	};

	mailgun.messages().send(data, function (error, body) {
	  console.log(body);
	});	
 
}


exports.API_sendMail = function(fromEmail, toEmail, subject, message, callback)
{
	var data = {
	  from: fromEmail,
	  to: toEmail,
	  subject: subject,
	  html: message
	};

	mailgun.messages().send(data, function (error, body) 
	{
	  console.log(body);
	  callback(error, body);
	});	
 
 
}

