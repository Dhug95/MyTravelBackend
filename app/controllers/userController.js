const User = require('../models/user');

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config = require('../../config'); // get our config file
const graph = require('fbgraph');

'use strict';
const nodemailer = require('nodemailer');

app.set('superSecret', config.secret); // secret variable

// route to create an account (POST http://localhost:8080/app/register)
exports.register = function (req, res) {
    // get parameters
    const email = req.query.email;
    const username = req.query.username;
    const password = req.query.password;

    // create user with parameters
    const newUser = new User({
        email: email,
        username: username,
        password: password,
        facebook: false
    });

    // save the new user
    newUser.save(function (err) {
        if (err) {
            res.json({success: false, message: err.message});
        } else {
            res.json({success: true, message: 'User created.'});
        }
    });
};

// route to authenticate a user (POST http://localhost:8080/app/authenticate)
exports.authenticate = function (req, res) {

    // find the user
    User.findOne({
        email: req.query.email
    }, function (err, user) {

        if (err) throw err;

        if (!user) {
            res.json({success: false, message: 'Authentication failed. User not found.'});
        } else if (user) {

            // check if password matches
            if (user.password !== req.query.password) {
                res.json({success: false, message: 'Authentication failed. Wrong password.'});
            } else {

                // if user is found and password is right
                // create a token with only our given payload
                // we don't want to pass in the entire user since that has the password
                const payload = {
                    id: user._id
                    //admin: user.admin
                };

                const token = jwt.sign(payload, app.get('superSecret'), {
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
exports.facebook_authenticate = function (req, res) {
    const facebook_token = req.query.facebook_token;

    const options = {
        timeout: 3000,
        pool: {maxSockets: Infinity},
        headers: {connection: "keep-alive"}
    };

    graph
        .setAccessToken(facebook_token)
        .setOptions(options)
        .get('me?fields=name, email', function (err, fbres) {
            if (err) {
                fbres.json({success: false, message: err.message});
            }

            const name = fbres['name'];
            const email = fbres['email'];

            console.log('Name = ' + name + ', Email= ' + email);

            // find the user
            User.findOne({email: email}, function (err, user) {

                if (err) throw err;

                if (!user) {

                    // create user with parameters
                    const newUser = new User({
                        email: email,
                        username: name,
                        facebook: true
                    });

                    // save the new user
                    newUser.save(function (err, newUser) {
                        if (err) {
                            res.json({success: false, message: err.message});
                        } else {
                            const payload = {
                                id: newUser._id
                            };
                            validateFBlogin(payload, res);
                        }
                    });

                } else {
                    const payload = {
                        id: user._id
                    };
                    validateFBlogin(payload, res);
                }
            })
        })
};

// route to get info about my user (GET http://localhost:8080/app/myprofile)
exports.my_profile = function (req, res) {
    User.findById(req.decoded.id, function (err, user) {
        res.json(user);
    });
};

// route to update user info (PUT http://localhost:8080/app/myprofile)
exports.update_profile = function (req, res) {
    const newUsername = req.query.username || req.body.username;
    const newEmail = req.query.email || req.body.email;
    const oldPassword = req.query.old_password || req.body.old_password;
    const newPassword = req.query.password || req.body.password;

    User.findById(req.decoded.id, function (err, user) {
        if (oldPassword !== user.password) {
            res.json({success: false, message: 'Current password not correct.'});
        } else {

            if (newUsername != null) {
                User.findByIdAndUpdate(req.decoded.id, {username: newUsername}, function (err, user) {
                    if (err) {
                        res.json(err);
                    }
                });
            }

            if (newEmail != null) {
                User.findByIdAndUpdate(req.decoded.id, {email: newEmail}, function (err, user) {
                    if (err) {
                        res.json(err);
                    }
                });
            }

            if (newPassword != null) {
                User.findByIdAndUpdate(req.decoded.id, {password: newPassword}, function (err, user) {
                    if (err) {
                        res.json(err);
                    }
                });
            }

            res.json({success: true, message: 'Info updated.'});
        }
    });
};

// route to retrieve forgotten password (GET http://localhost:8080/app/forgot_password)
exports.forgot_password = function (req, res) {
    const email = req.query.email;

    User.findOne({email: email}, function (err, user) {
        if (err) {
            console.log(err.message);
            res.json({success: false, message: err.message});
        } else {
            if (!user || user.facebook === true) {
                res.json({success: false, message: 'User not found.'});
            } else {
                console.log(user);
                // Generate test SMTP service account from ethereal.email
                // Only needed if you don't have a real mail account for testing
                nodemailer.createTestAccount((err, account) => {

                    let transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'mytravelrome@gmail.com',
                            pass: 'nouraboubou'
                        }
                    });

                    // setup email data with unicode symbols
                    let mailOptions = {
                        from: 'My Travel Company <mytravelrome@gmail.com>', // sender address
                        to: user.email, // list of receivers
                        subject: 'Forgotten password', // Subject line
                        text: 'Here\'s your password: ' + user.password // plain text body
                    };

                    // send mail with defined transport object
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                        console.log('Message sent: %s', info.messageId);
                        // Preview only available when sending through an Ethereal account
                        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                        res.json({success: true, message: 'An email has been sent to your address.'})
                        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                    });
                });
            }
        }
    });
};

function validateFBlogin(payload, res) {
    const token = jwt.sign(payload, app.get('superSecret'), {
        expiresIn: 1440 // expires in 24 hours
    });

    // return the information including token as JSON
    res.json({
        success: true,
        message: 'Enjoy your token!',
        token: token
    });
}
