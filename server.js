var twitterAPI = require('node-twitter-api');
var keys = require('./twitterkeys');
console.log(twitterAPI);
var twitter = new twitterAPI({
    consumerKey: keys.consumerKey,
    consumerSecret: keys.consumerSecret
});

/*
twitter.statuses('update', {
        "status": 'Tweet from node!',
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
);*/
