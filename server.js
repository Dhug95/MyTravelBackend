// =============================
// get the packages we need ====
// =============================
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config = require('./config'); // get our config file
const mongoose = require('mongoose');
const request = require('request');

// Require controller modules.
const user_controller = require('./app/controllers/userController');
const trip_controller = require('./app/controllers/tripController');
const dest_controller = require('./app/controllers/destController');

// =======================
// configuration =========
// =======================
const port = process.env.PORT || 8080; // used to create, sign, and verify tokens

mongoose.connect(config.databasecloud, {useNewUrlParser: true}); // connect to database

app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// routes ================
// =======================

// get an instance of the router for api routes
const apiRoutes = express.Router();


/// USER CONTROLLER


// route to create an account (POST http://localhost:8080/app/register)
apiRoutes.post('/register', user_controller.register);

// route to authenticate a user (POST http://localhost:8080/app/authenticate)
apiRoutes.post('/authenticate', user_controller.authenticate);

// route for facebook login (POST http://localhost:8080/app/facebook_login)
apiRoutes.post('/facebook_login', user_controller.facebook_authenticate);

// route to retrieve forgotten password (GET http://localhost:8080/app/forgot_password)
apiRoutes.get('/forgot_password', user_controller.forgot_password);

// =======================

// middleware for token
apiRoutes.use(function (req, res, next) {

    // check header or url parameters or post parameters for token
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function (err, decoded) {
            if (err) {
                return res.json({success: false, message: 'Failed to authenticate token.'});
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

// route to delete a single trip (DELETE http://localhost:8080/app/trips/:trip_id)
apiRoutes.delete('/trips/:trip_id', trip_controller.delete_trip);

//route to add a participant to the trip (POST http://localhost:8080/app/trips/:trip_id/add_participant)
apiRoutes.post('/trips/:trip_id/add_participant', trip_controller.add_participant);

//route to delete a participant to the trip (DELETE http://localhost:8080/app/trips/:trip_id/remove_part)
apiRoutes.delete('/trips/:trip_id/remove_part', trip_controller.remove_participant);

//route to get participants list (GET http://localhost:8080/app/trips/:trip_id/get_participants)
apiRoutes.get('/trips/:trip_id/get_participants', trip_controller.get_participants);

//route to add a payment to the trip (POST http://localhost:8080/app/trips/:trip_id/add_payment)
apiRoutes.post('/trips/:trip_id/add_payment', trip_controller.add_payment);

//route to get payments list (GET http://localhost:8080/app/trips/:trip_id/get_payments)
apiRoutes.get('/trips/:trip_id/get_payments', trip_controller.get_payments);

//route to remove payment (DELETE http://localhost:8080/app/trips/:trip_id/remove_payment)
apiRoutes.delete('/trips/:trip_id/remove_payment', trip_controller.remove_payment);


/// DEST CONTROLLER


// route to create a dest (POST http://localhost:8080/app/trips/:trip_id/destinations)
apiRoutes.post('/trips/:trip_id/destinations', dest_controller.create_dest);

// route to create a dest (GET http://localhost:8080/app/trips/:trip_id/destinations)
apiRoutes.get('/trips/:trip_id/destinations', dest_controller.get_dests);

// route to get a single dest (GET http://localhost:8080/app/trips/:trip_id/destinations/:dest_id)
apiRoutes.get('/trips/:trip_id/destinations/:dest_id', dest_controller.get_destination);

// route to delete a single destination (DELETE http://localhost:8080/app/trips/:trip_id/destinations/:dest_id)
apiRoutes.delete('/trips/:trip_id/destinations/:dest_id', dest_controller.delete_destination);


// apply the routes to our application with the prefix /app
app.use('/app', apiRoutes);


// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at Roma Montesacro');