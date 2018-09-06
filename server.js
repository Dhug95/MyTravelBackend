// =============================
// get the packages we need ====
// =============================
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var mongoose = require('mongoose');

// Require controller modules.
var user_controller = require('./app/controllers/userController');
var trip_controller = require('./app/controllers/tripController');

// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens

mongoose.connect(config.databasecloud, { useNewUrlParser: true }); // connect to database

app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// routes ================
// =======================

// get an instance of the router for api routes
var apiRoutes = express.Router();


/// USER CONTROLLER


// route to create an account (POST http://localhost:8080/app/register)
apiRoutes.post('/register', user_controller.register);

// route to authenticate a user (POST http://localhost:8080/app/authenticate)
apiRoutes.post('/authenticate', user_controller.authenticate);


// =======================

// middleware for token
apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });

  }
});

// =======================


// route to get info about my user (GET http://localhost:8080/app/myprofile)
apiRoutes.get('/myprofile', user_controller.my_profile);

// route to update user info (PUT http://localhost:8080/app/myprofile)
apiRoutes.put('/myprofile', user_controller.update_profile);


/// TRIP CONTROLLER


// route to create a trip (POST http://localhost:8080/app/trips)
apiRoutes.post('/trips', trip_controller.create_trip);

// route to return all my trips (GET http://localhost:8080/app/mytrips)
apiRoutes.get('/mytrips', trip_controller.my_trips);

// route to get a single trip (GET http://localhost:8080/app/trips/:trip_id)
apiRoutes.get('/trips/:trip_id', trip_controller.get_trip);

// apply the routes to our application with the prefix /app
app.use('/app', apiRoutes);

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
