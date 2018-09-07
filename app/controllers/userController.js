var User = require('../models/user');

var express = require('express');
var app = express();
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../../config'); // get our config file
const graph = require('fbgraph');

app.set('superSecret', config.secret); // secret variable

// route to create an account (POST http://localhost:8080/app/register)
exports.register = function(req, res) {
	// get parameters
	var email = req.query.email
	var username = req.query.username
	var password = req.query.password

	// create user with parameters
	var newUser = new User({
		email: email,
		username: username,
		password: password
	});

	// save the new user
	newUser.save(function(err) {
		if (err) {
			res.json({ success: false, message: err.message });
		} else {
			res.json({ success: true, message: 'User created.' });
		}
	});
};

// route to authenticate a user (POST http://localhost:8080/app/authenticate)
exports.authenticate = function(req, res) {

  // find the user
  User.findOne({
    email: req.query.email
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.query.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token with only our given payload
    		// we don't want to pass in the entire user since that has the password
    		const payload = {
					id: user._id
      		//admin: user.admin
    		};

        var token = jwt.sign(payload, app.get('superSecret'), {
          expiresIn: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }

    }

  });
};

// route for facebook login (POST http://localhost:8080/app/facebook_login)
exports.facebook_authenticate = function(req, res) {
	const facebook_token = req.query.facebook_token;

	var options = {
    timeout:  3000,
   	pool:     { maxSockets:  Infinity },
   	headers:  { connection:  "keep-alive" }
	};

	graph
		.setAccessToken(facebook_token)
	  .setOptions(options)
	  .get('me?fields=name, email', function(err, res) {
	    console.log(res); // { id: '4', name: 'Mark Zuckerberg'... }
	  });

		res.json({ success: true, message: 'Dio cane' });
};

// route to get info about my user (GET http://localhost:8080/app/myprofile)
exports.my_profile = function(req, res) {
	User.findById(req.decoded.id, function(err, user) {
    res.json(user);
 	});
};

// route to update user info (PUT http://localhost:8080/app/myprofile)
exports.update_profile = function(req, res) {
	var newUsername = req.query.username || req.body.username
	var newEmail = req.query.email || req.body.email
	var oldPassword = req.query.old_password || req.body.old_password
	var newPassword = req.query.password || req.body.password

	User.findById(req.decoded.id, function(err, user) {
		if (oldPassword != user.password) {
			res.json({ success: false, message: 'Current password not correct.' });
		} else {

			if (newUsername != null) {
				User.findByIdAndUpdate(req.decoded.id, { username: newUsername }, function(err, user) {
        	if (err) {
            res.json(err);
        	}
    		});
			}

			if (newEmail != null) {
				User.findByIdAndUpdate(req.decoded.id, { email: newEmail }, function(err, user) {
        	if (err) {
            res.json(err);
        	}
    		});
			}

			if (newPassword != null) {
				User.findByIdAndUpdate(req.decoded.id, { password: newPassword }, function(err, user) {
        	if (err) {
            res.json(err);
        	}
    		});
			}

			res.json({ success: true, message: 'Info updated.' });
		}
	});
};
