const Dest = require('../models/destination');

// route to create a dest (POST http://localhost:8080/app/trips/:trip_id/destinations)
exports.create_dest = function (req, res) {
    console.log("CREATE DEST");
    // get parameters
    const name = req.query.name;
    const country = req.query.country;
    const trip_id = req.query.trip_id;
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;

    const newDest = new Dest({
        name: name,
        country: country,
        trip: trip_id,
        latitude: latitude,
        longitude: longitude
    });

    // save the destination
    newDest.save(function (err) {
        if (err) {
            console.log(err.message);
            res.json({success: false, message: err.message});
        } else {
            console.log("Success");
            res.json({success: true, message: 'Destination correctly added'});
        }
    });
};

// route to get destinations (GET http://localhost:8080/app/trips/:trip_id/destinations)
exports.get_dests = function (req, res) {
    const trip_id = req.query.trip_id;
    Dest.find({trip: trip_id}, function (err, dests) {
        res.json(dests);
    });
};

// route to get a single dest (GET http://localhost:8080/app/trips/:trip_id/destinations/:dest_id)
exports.get_destination = function (req, res) {
    Dest.findById(req.params.dest_id, function (err, dest) {
        if (err) {
            res.json({success: false, message: err.message});
        } else {
            res.json(dest);
        }
    });
};

// route to delete a single destination (DELETE http://localhost:8080/app/trips/:trip_id/destinations/:dest_id)
exports.delete_destination = function (req, res) {
    Dest.findByIdAndDelete(req.params.dest_id, function (err, dest) {
        if (err) {
            res.json({success: false, message: err.message});
        } else {
            res.json({success: true, message: 'Destination deleted.'});
        }
    });
};

/* route to get info about weather
apiRoutes.get('/dest_weather', function (req, res) {
    const lat = req.query.lat;
    const lon = req.query.lng;
    const APIKEY = 'a20716cacf4034bea5188e75d6a0b44b';

    request(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${APIKEY}&units=metric`,
        {json: true}, (err, forecast, body) => {
            if (err) {
                return console.log(err);
            }
            res.json(forecast['body']);
        });
}); */