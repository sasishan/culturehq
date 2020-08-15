var 
  config = require('./config'), 
  // OpsConfig = require('./OperationsConfig'),
  express = require('express'),
  http = require('http'),
  path = require('path'),
  monk = require('monk'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  cognitoExpress = require('cognito-express'),  
  //ROUTES
  // Operations = require('./routes/Operations'),
  APIs = require('./APIs')
  ;
  // Database = require('./Database/Database');

// const { authenticate, authenticationError } = require('aws-cognito-express');
const app = express();
const dbURI = config.dbURI;
const db = monk(dbURI);

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
    res.header("Access-Control-Allow-Origin", "http://localhost:8080"); // restrict it to the required domain
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

  validateToken(accessTokenFromClient, function(err, response)
  {
    if (err) 
    {           
      console.log(err);
      return res.status(401).send('Invalid token');
    }

    req.user = response;
    req.eId = response.username;
    next();

  });
}

var isNotAuthenticated = function (req, res, next) 
{
    req.user = {};
    req.eId = 'anonymous'+ new Date().toString();
    next();
}

validateToken = function(accessTokenFromClient, callback)
{
  try
  {
    cognito.validate(accessTokenFromClient, function(err, response) 
    {
        //If API is not authenticated, Return 401 with error message. 
        if (err) 
        {           
          console.log(err);
          callback(err, null);
          // return res.status(401).send('Invalid token');
        }

        callback(null, response);
    }); 
  }
  catch(err)
  {
      console.log(err);
      callback(err, null);
  }
  
}

//API routes
app.get('/api/v1/engagement', isNotAuthenticated, APIs.receiveAPIRequest);
// app.get(OpsConfig.APIPaths.GET_OneJotsSections, isAuthenticated, APIs.receiveAPIRequest);

//HTTP SERVER
var server = http.createServer(app);

server.listen(app.get('port'), function()
{
  console.log('CultureHQ server started and listening on port ' + app.get('port'));
});
