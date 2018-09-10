const Dest = require('../models/destination');

// route to create a dest (POST http://localhost:8080/app/trips/:trip_id/destinations)
exports.create_dest = function (req, res) {
    console.log("CREATE DEST");
    // get parameters
    const name = req.query.name;
    const country = req.query.country;
    const trip_id = req.query.trip_id;

    const newDest = new Dest({
        name: name,
        country: country,
        trip: trip_id
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