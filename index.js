var Botkit = require('botkit');
var CronJob = require('cron').CronJob;
var http = require('http');
var url = require('url');

var controller = Botkit.slackbot({
    debug: false,
    json_file_store: 'storage_bot_db'
});


var bot = controller.spawn({
    token: process.env.token
}).startRTM(function(err, bot, payload) {
    if (err) {
        console.log('Error: Cannot to Slack');
        process.exit(1);
    }
    job = new CronJob({
            // 毎時00分に投稿
            cronTime: '00 * * * *',
            onTick: function() {
                bot.say({
                    channel: 'チャンネルIDをここへ記載',
                    text: '投稿メッセージA'
                });
            },
            start: false,
            timeZone: 'Asia/Tokyo'
        });
    job.start();
    job2 = new CronJob({
            // 毎日23時59分に投稿
            cronTime: '59 23 * * *',
            onTick: function() {
                bot.say({
                    channel: 'チャンネルIDをここへ記載',
                    text: '投稿メッセージB'
                });
            },
            start: false,
            timeZone: 'Asia/Tokyo'
        });
    job2.start();
});

controller.hears(['反応するキーワード（部分一致）', '(できた|出来た)', '←正規表現も可'], ['ambient'], function(bot, message) {
    bot.reply(message, 'リプライするメッセージをここへ記載');
});


// To keep Heroku's free dyno awake
http.createServer(function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Ok, dyno is awake.');
}).listen(process.env.PORT || 5000);