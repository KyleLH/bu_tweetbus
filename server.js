var keys = require('./twitterkeys');
var request = require('request');
var twitterAPI = require('node-twitter-api');

var twitter = new twitterAPI({
    consumerKey: keys.consumerKey,
    consumerSecret: keys.consumerSecret,
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
                            buses[cur_bus].estimates = allBuses[i].arrival_estimates;
                        }


                        // check if just passed a stop
                        if(buses[cur_bus].estimates[0].stop_id != allBuses[i].arrival_estimates[0].stop_id
                                && (stops[allBuses[i].arrival_estimates[1].stop_id] == 'Student Village 2'
                                || stops[allBuses[i].arrival_estimates[1].stop_id] == 'Nickerson Field'
                                || stops[allBuses[i].arrival_estimates[1].stop_id] == 'Marsh Plaza') {

                            var date = new Date(allBuses[i].arrival_estimates[1].arrival_at);
                            var tod = date.getHours() > 12 ? "PM" : "AM";
                            var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
                            var min = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                            var time = hours + ":" + min + " " + tod;
                            var status = "Bus to " + stops[allBuses[i].arrival_estimates[1].stop_id] + " in " + time;

                            console.log(status);

                            // tweet to your hearts content
                            /*twitter.statuses('update', {
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
                            ); */

                            buses[cur_bus].estimates = allBuses[i].arrival_estimates;

                        }
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

console.log("requests successful");
