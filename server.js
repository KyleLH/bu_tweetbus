var TwitterBot = require("node-twitterbot").TwitterBot;

var bot = new TwitterBot({
    'consumer_key': 'k26SEC2WkLuDTS7sI0Off97wt',
    'consumer_secret': 'GcgwnuJiFlgF19u9ZwA2NenmqEttFkccKp7D4KcWoojEOpMGqh',
    'access_token': '2775863764-aQ1jjei1smviiGrU6UHixb9y9h4LZuWlIgWsYLU',
    'access_token_secret': 'MC7EltAHW7u1cZirzFvvYywdUI7noDhBdoW5oUUC3Vau9'
});

bot.addAction('tweet', function (twitter, action, tweet) {
    console.log(bot.tweet('a tweet from node'));
});

bot.now('tweet');
