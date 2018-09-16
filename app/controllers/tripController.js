const User = require('../models/user');
const Trip = require('../models/trip');

// route to create a trip (POST http://localhost:8080/app/trips)
exports.create_trip = function (req, res) {
    // get parameters
    const name = req.query.name;
    const start = req.query.start;
    const end = req.query.end;

    User.findById(req.decoded.id, function (err, user) {
        // create user with parameters
        const newTrip = new Trip({
            name: name,
            startDate: start,
            endDate: end,
            creator: user._id,
            participants: [user.username]
        });

        // save the new user
        newTrip.save(function (err) {
            if (err) {
                res.json({success: false, message: err.message});
            } else {
                res.json({success: true, message: 'Trip correctly added.'});
            }
        });
    });

};

// route to return all my trips (GET http://localhost:8080/app/mytrips)
exports.my_trips = function (req, res) {
    Trip.find({participants: req.decoded.username}, function (err, trips) {
        res.json(trips);
    });
};

// route to get a single trip (GET http://localhost:8080/app/trips/:trip_id)
exports.get_trip = function (req, res) {
    Trip.findById(req.params.trip_id, function (err, trip) {
        if (err) {
            res.json(err);
        } else {
            res.json(trip);
        }
    });
};

// route to delete a single trip (DELETE http://localhost:8080/app/trips/:trip_id)
exports.delete_trip = function (req, res) {
    Trip.findByIdAndDelete(req.params.trip_id, function (err, trip) {
        if (err) {
            res.json(err);
        } else {
            res.json({success: true, message: 'Trip deleted.'});
        }
    });
};

//route to add a participant to the trip (POST http://localhost:8080/app/trips/:trip_id/add_participant)
exports.add_participant = function (req, res) {
    const trip_id = req.query.trip_id;
    const username = req.query.username;

    User.findOne({username: username}, function (err, user) {
        if (err) {
            res.json({success: false, message: err.message});
        } else {
            if (!user) {
                res.json({success: false, message: "User not found."});
            } else {
                Trip.findByIdAndUpdate(trip_id, {$push: {participants: username}}, function (err, trip) {
                    if (err) {
                        res.json({success: false, message: err.message});
                    } else {
                        res.json({success: true, message: 'User added'});
                    }
                });
            }
        }
    });
};

//route to delete a participant to the trip (DELETE http://localhost:8080/app/trips/:trip_id/remove_part)
exports.remove_participant = function (req, res) {
    const trip_id = req.query.trip_id;
    const username = req.query.username;

    Trip.findByIdAndUpdate(trip_id, {$pull: {participants: username}}, function (err, trip) {
        if (err) {
            res.json({success: false, message: err.message});
        } else {
            res.json({success: true, message: 'User removed.'});
        }
    });
};

//route to get participants list (GET http://localhost:8080/app/trips/:trip_id/get_participants)
exports.get_participants = function (req, res) {
    const trip_id = req.query.trip_id;
    Trip.findById(trip_id, function (err, trip) {
        if (err) {
            res.json({success: false, message: err.message});
        } else {
            res.json(trip.participants);
        }
    })
};

//route to add a payment to the trip (POST http://localhost:8080/app/trips/:trip_id/add_payment)
exports.add_payment = function (req, res) {
    const trip_id = req.query.trip_id;
    const amount = req.query.amount;
    const username = req.decoded.username;

    const newPayment = {
        username: username,
        amount: amount
    };

    Trip.findByIdAndUpdate(trip_id, {$push: {payments: newPayment}}, function (err, trip) {
        if (err) {
            res.json({success: false, message: err.message});
        } else {
            res.json({success: true, message: 'Payment added.'});
        }
    });
};

//route to get payment list (GET http://localhost:8080/app/trips/:trip_id/get_payments)
exports.get_payments = function (req, res) {
    const trip_id = req.query.trip_id;
    Trip.findById(trip_id, function (err, trip) {
        if (err) {
            res.json({success: false, message: err.message});
        } else {
            res.json({payments: trip.payments, user: req.decoded.username, number: trip.participants.length});
        }
    })
};

//route to remove payment (DELETE http://localhost:8080/app/trips/:trip_id/remove_payment)
exports.remove_payment = function (req, res) {
    const trip_id = req.query.trip_id;
    const payment_id = req.query.payment_id;
    const username = req.query.username;
    const amount = req.query.amount;

    const paymentToRemove = {
        _id: payment_id
    };

    Trip.findByIdAndUpdate(trip_id, {$pull: {payments: paymentToRemove}}, function (err, trip) {
        if (err) {
            res.json({success: false, message: err.message});
        } else {
            res.json({success: true, message: 'Payment deleted.'});
        }
    });
};
