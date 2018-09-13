const User = require('../models/user');
const Trip = require('../models/trip');

// route to create a trip (POST http://localhost:8080/app/balance)
exports.create_balance = function (req, res) {
    const trip_id = req.query.trip_id;
    const username = req.query.username;

    // create user with parameters
    const newBalance = new Balance({
        trip_id: trip_id,
        amount: '0',
        username: username
    });

    // save the new balance
    newBalance.save(function (err) {
        if (err) {
            res.json({success: false, message: err.message});
        } else {
            console.log(newBalance);
            res.json({success: true, message: 'Balance correctly added.'});
        }
    });
};