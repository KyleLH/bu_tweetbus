var keys = require('./twitterkeys');
var request = require('request');
var twitterAPI = require('node-twitter-api');

var twitter = new twitterAPI({
    consumerKey: keys.consumerKey,
    consumerSecret: keys.consumerSecret
});
var stops = {};
var buses = {};

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
            }
            console.log(stops);
        } else {
            console.log('Error: \n' + e);
        }
    }
);


// retrieve bus locations
setInterval (function () {
    url = 'http://www.bu.edu/bumobile/rpc/bus/livebus.json.php';

    request({
            url: url,
            json: true,
        },

        function (e, res, body) {
            if (!e && res.statusCode === 200 && body.ResultSet) {
                var allBuses = body.ResultSet.Result;
                for (i in allBuses) {
                    if (allBuses[i].arrival_estimates) {
                        var index = buses.length-1
                        cur_bus = allBuses[i].call_name

                        // initialize buses
                        if (!(buses[cur_bus])) {
                            console.log("Initiate bus at " + cur_bus);
                            buses[cur_bus] = {};
                            buses[cur_bus].estimate = allBuses[i].arrival_estimates[0];
                        }
                        
                        // check if just passed a stop
                        if(buses[cur_bus].estimate.stop_id != allBuses[i].arrival_estimates[0].stop_id) {
                            var date = new Date(allBuses[i].arrival_estimates[0].arrival_at);
                            var tod = date.getHours() > 12 ? "PM" : "AM";
                            var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
                            var min = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                            console.log("A bus just passed " + stops[buses[cur_bus].estimate.stop_id] + '\nNext stop: ' +
                                stops[allBuses[i].arrival_estimates[0].stop_id] + '\nETA: ' +
                                hours + ":" + min + " " + tod);

                            // tweet to your hearts content
                            var status = "A bus just passed " + stops[buses[cur_bus].estimate.stop_id] + "\nNext stop: " +
                                stops[allBuses[i].arrival_estimates[0].stop_id] + "\nETA: " +
                                // find the actual correct variable, not timeEstimate
                                hours + ":" + min + " " + tod;
                            twitter.statuses('update', {
                                    "status": status,
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

                            buses[cur_bus].estimate = allBuses[i].arrival_estimates[0];

                        }

                        /*
                        // the tweet
                        var status = "A bus just passed " + buses[index].prev_stop + ". \nNext stop: " +
                            buses[index].estimates.arrival_estimates[0].stop_id + "\nETA: " +
                            // find the actual correct variable, not timeEstimate
                            buses[index].estimates.arrival_estimates[0].timeEstimate;
                            console.log(buses);
                        twitter.statuses('update', {
                                "status": status,
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
                    }
                }

                //for (i in buses) {
                    
                //}
            } else {
                console.log('Error: \n' + e);
            }
        }
    );
}, 5000);

var direction = function (bus) {
    // if next stop is west or north of current bus, it's going outbound (westward)
    // if next stop is east or south of current bus, it's going inbound (eastward)
}

console.log("requests successful");
// bus is a dictionary of { lat: float, long: float, heading: int}
// stop is a dictionary of { lat: float, long: float }

// Tweet about it why don't you

