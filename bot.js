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
        }
    ];
}