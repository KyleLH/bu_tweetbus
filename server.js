var keys = require('./twitterkeys');
var request = require('request');
var twitterAPI = require('node-twitter-api');

var twitter = new twitterAPI({
    consumerKey: keys.consumerKey,
    consumerSecret: keys.consumerSecret
});
var stops = {};
var buses = [];

// retrieve bus stops
var url = 'http://www.bu.edu/bumobile/rpc/bus/stops.json.php?service_id=fall';

request({
        url: url,
        json: true,
    },
    function (e, res, body) {
        if (!e && res.statusCode === 200) {
            var allStops = body.ResultSet.Result;
            for (i in allStops) {
                stops[allStops[i].transloc_stop_id] = allStops[i].stop_name;
                // stops.push(allStops[i].stop_name);
            }
            // stops = stops.filter(function (elem, pos) {
              //  return stops.indexOf(elem) == pos;
            //});
            console.log(stops);
        } else {
            console.log('Error: \n' + e);
        }
    }
);


// retrieve bus locations
url = 'http://www.bu.edu/bumobile/rpc/bus/livebus.json.php';

request({
        url: url,
        json: true,
    },
    function (e, res, body) {
        if (!e && res.statusCode === 200) {
            var allBuses = body.ResultSet.Result;
            for (i in allBuses) {
                if (allBuses[i].arrival_estimates) {
                    buses.push(allBuses[i]);
                }
            }
            console.log(buses);
        } else {
            console.log('Error: \n' + e);
        }
    }
);

console.log("requests successful");
// bus is a dictionary of { lat: float, long: float, heading: int}
// stop is a dictionary of { lat: float, long: float }

var isApproaching = function (bus, stop) {
    
};
// Tweet about it why don't you
/*
twitter.statuses('update', {
        "status": 'LOOK it\'s a tweeting bus!',
    },
    keys.token,
    keys.secret,
    function (error, data, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("success");
        }
    }
);
*/
