var 
  config = require('./config'), 
  // OpsConfig = require('./OperationsConfig'),
  express = require('express'),
  http = require('http'),
  path = require('path'),
  mysql = require('mysql'),
  cron = require('node-cron'),
  // monk = require('monk'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  cognitoExpress = require('cognito-express'),  
  //ROUTES
  // Operations = require('./routes/Operations'),
  APIs = require('./APIs'),
  Database = require('./database/Database'),
  Engagement = require('./routes/Engagement')
  ;
  // Database = require('./Database/Database');
var args = process.argv.slice(2);

// const { authenticate, authenticationError } = require('aws-cognito-express');
const app = express();
// const dbURI = config.dbURI;

const db = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
});

db.connect((err) => {
  if(err)
  {
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});

// const db = monk(dbURI);
const cognito = new cognitoExpress(config.COGNITO_CONFIG);

app.set('port', process.env.PORT || config.port);
app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) 
{
    // CORS headers
    //https://jotdot.honchohq.com/
    if (args.includes('-dev'))
    {
      res.header("Access-Control-Allow-Origin", "http://localhost:8080"); // restrict it to the required domain  
    }
    else
    {
      res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain  
    }
    
    res.header("Access-Control-Allow-Credentials", true); // restrict it to the required domain
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    // Set custom headers for CORS
    res.header("Access-Control-Allow-Headers", "_a,_b,_c,_d,_h,_n,_s,_v,Content-type,Accept,X-Custom-Header,AccessToken,email,Authorization");

    if (req.method === "OPTIONS") 
    {
        return res.status(200).end();
    }

    return next();
});

app.use (function(req, res, next) 
{
  req.db = db; 
  next(); 
});


var isAuthenticated = function (req, res, next) 
{
  var accessTokenFromClient = req.headers.accesstoken;

  if (!accessTokenFromClient) 
  {
    return res.status(401).send("Access Token missing from header");
  }

  cognito.validate(accessTokenFromClient, function(err, response)
  {
    if (err) 
    {           
      console.log(err);
      return res.status(401).send('Invalid token');
    }

    req.idToken = req.headers.authorization;
    req.userId = response.username;

    Database.getUserProfile(req.db, req.userId , function(err, userProfile)
    {
      if (err || userProfile.length==0) 
      {           
        console.log(err);
        return res.status(401).send('User not found');
      }       

      try
      {
        var profile = JSON.parse(userProfile);
        req.userProfile = profile[0];
        next();
      }
      catch (error)
      {
        console.log(error);
        return res.status(401).send('User not found');
      }

    });  
    // next();

  });
}

var isNotAuthenticated = function (req, res, next) 
{
    req.user = {};
    req.userId = 'anonymous'+ new Date().toString();
    next();
}


//API routes
app.get('/api/v1/test', isAuthenticated, APIs.receiveAPIRequest);
app.get('/api/v1/engagement/dailyquestions', isAuthenticated, APIs.receiveAPIRequest);
app.get('/api/v1/engagement/publishedquestions', isAuthenticated, APIs.receiveAPIRequest);
app.get('/api/v1/engagement/responses', isAuthenticated, APIs.receiveAPIRequest);
app.get('/api/v1/events', isNotAuthenticated, APIs.receiveAPIRequest);
app.get('/api/v1/oneonone/questionbank', isAuthenticated, APIs.receiveAPIRequest);
app.get('/api/v1/oneonone/questionbank/categories', isAuthenticated, APIs.receiveAPIRequest);
app.get('/api/v1/oneonone/templates', isAuthenticated, APIs.receiveAPIRequest);
app.get('/api/v1/engagement/sendlogs', isAuthenticated, APIs.receiveAPIRequest);
app.get('/api/v1/myprofile', isAuthenticated, APIs.receiveAPIRequest);
app.get('/api/v1/engagement/recommendations', isAuthenticated, APIs.receiveAPIRequest);
app.post('/api/v1/engagement/recommendations/question', isAuthenticated, APIs.receiveAPIRequest);
app.post('/api/v1/engagement/sendonequestion',isAuthenticated, APIs.receiveAPIRequest);
app.post('/api/v1/engagement/:questionId/publish',isAuthenticated, APIs.receiveAPIRequest);
app.post('/api/v1/engagement/dailyquestion/:questionId/update',isAuthenticated, APIs.receiveAPIRequest);

// app.post('/api/v1/engagement/:questionid/unpublish',isAuthenticated, APIs.receiveAPIRequest);
app.post('/api/v1/engagement/newquestion',isAuthenticated, APIs.receiveAPIRequest);


// app.get(OpsConfig.APIPaths.GET_OneJotsSections, isAuthenticated, APIs.receiveAPIRequest);



//HTTP SERVER
var server = http.createServer(app);

server.listen(app.get('port'), function()
{
  if (args.includes('-nodaily')==false && args.includes('-dev')==false)
  {
    console.log(new Date());
    var cronSched = '0 8 * * *';
    console.log('Daily scheduled notification process initiated: ' + cronSched);
    var task= cron.schedule(cronSched, function()
    {
      console.log('Running daily scheduled notification process: ' + cronSched);
      console.log(new Date());
      Engagement.runDailySurveyQuestion(db, function(error, result)
        {
          console.log('runDailySurveyQuestion executed.');
        });
    }); 
  }
 
  console.log('CultureHQ server started and listening on port ' + app.get('port'));


    // Engagement.runDailySurveyQuestion(db, function(error, result)
    //   {
    //     console.log('runDailySurveyQuestion executed.');
    //   });
});
