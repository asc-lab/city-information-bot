require('dotenv-extended').load();

const builder = require('botbuilder');
const backend = process.env.MOCK_BACKEND === 'true' ? require('./backend-mock') : require('./backend');

const connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

const inMemoryStorage = new builder.MemoryBotStorage();

const bot = module.exports = new builder.UniversalBot(connector, getSteps()).set('storage', inMemoryStorage);

// log any bot errors into the console
bot.on('error', function (e) {
    console.log('And error occurred', e);
});

// Send welcome when conversation with bot is started, by initiating the root dialog
bot.on('conversationUpdate', function (message) {
    initRootDialog(message);
});

function initRootDialog(message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                bot.beginDialog(message.address, '/');
            }
        });
    }
}

function getSteps() {
    return [
        function (session, results, next) {
            session.send('Hello in ASC LAB What Time Bot!');
            next();
        },
        function (session) {
            builder.Prompts.choice(
                session,
                'Please choose one of the most popular cities or choose "Other..." if you ask about another.',
                ['Warsaw', 'London', 'New York', 'Berlin', 'Other...'],
                {
                    maxRetries: 3,
                    retryPrompt: 'Not a valid option'
                });
        },
        function (session, result) {
            if (!result.response) {
                session.send('Ooops! Too many attemps :( Try again!');
                session.endDialog();
            }

            session.on('error', function (err) {
                session.send('Failed with message: %s', err.message);
                session.endDialog();
            });

            const selection = result.response.entity;
            if (selection === 'Other...') {
                session.beginDialog('custom-city');
            } else {
                //FIXME make it DRY
                backend.getTimeFor(selection).then(function (time) {
                    session.send(`Time for ${selection} is: ${time}`);
                    session.endDialog();
                });
                backend.getWeather(selection).then(function(weather){
                    session.send(`Detailed weather information for ${selection}: ${weather}`);
                    session.endDialog();
                });
            }
        }
    ];
}

bot.dialog('custom-city', getCustomCitySteps());

function getCustomCitySteps() {
    return [
        function (session) {
            builder.Prompts.text(session, 'Please type city:');
        },
        function (session, results) {
            let selection = results.response;
            //FIXME make it DRY
            backend.getTimeFor(selection).then(function (time) {
                session.send(`Time for ${selection} is: ${time}`);
                session.endDialog();
            });
            backend.getWeather(selection).then(function(weather){
                session.send(`Detailed weather information for ${selection} is: ${weather}`);
                session.endDialog();
            });
        },
    ];
}