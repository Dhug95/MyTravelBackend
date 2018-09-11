const User = require('../models/user');
const Trip = require('../models/trip');

// route to create a trip (POST http://localhost:8080/app/trips)
exports.create_trip = function (req, res) {
    // get parameters
    const name = req.query.name;
    const start = req.query.start;
    const end = req.query.end;
    const image = req.query.image;

    User.findById(req.decoded.id, function (err, user) {
        // create user with parameters
        const newTrip = new Trip({
            name: name,
            startDate: start,
            endDate: end,
            creator: user._id,
            image: image,
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
    Trip.find({creator: req.decoded.id}, function (err, trips) {
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

    User.findOne({ username: username }, function (err, user) {
        if (err) {
            res.json({success: false, message: err.message});
        } else {
            if (!user) {
                res.json({success: false, message: "User not found."});
            } else {
                Trip.findByIdAndUpdate(trip_id, { $push: { participants: username }}, function (err, trip) {
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
