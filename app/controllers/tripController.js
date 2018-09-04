var User = require('../models/user');
var Trip = require('../models/trip');

// route to create a trip (POST http://localhost:8080/app/trips)
exports.create_trip = function(req, res) {
	// get parameters
	var name = req.query.name
	var start = req.query.start
	var end = req.query.end

	User.findById(req.decoded.id, function(err, user) {
		// create user with parameters
		var newTrip = new Trip({
			name: name,
			startDate: start,
			endDate: end,
			creator: user._id
		});

		// save the new user
		newTrip.save(function(err) {
			if (err) {
				res.json({ success: false, message: err.message });
			} else {
				res.json({ success: true, message: 'Trip correctly added.' });
			}
		});
	});

};

// route to return all my trips (GET http://localhost:8080/app/mytrips)
exports.my_trips = function(req, res) {
  Trip.find({ creator: req.decoded.id }, function(err, trips) {
    res.json(trips);
  });
};

// route to get a single trip (GET http://localhost:8080/app/trips/:trip_id)
exports.get_trip = function(req, res) {
  Trip.findById(req.params.trip_id, function(err, trip) {
    if (err) {
      res.json(err);
		} else {
			res.json(trip);
		}
  });
};
