# What time is it?
Chatbot that can answer the question: "What time is in Chicago (or any other city)"?

This bot is build with [**Bot Builder SDK (Microsoft Bot Framework) v3**](https://github.com/Microsoft/BotBuilder).


## Prerequisites
* ```.env``` file based on ```.env-example```.
```
MICROSOFT_APP_ID=
MICROSOFT_APP_PASSWORD=

MOCK_BACKEND=false

GEOCODE_API_URL=https://maps.googleapis.com/maps/api/geocode/json?address=REPLACE_THIS&key=YOUR_KEY
TIMEZONE_API_URL=https://maps.googleapis.com/maps/api/timezone/json?location=REPLACE_THIS&key=YOUR_KEY
```

## Build
```
npm install
```

## Run
```
npm run start
```
Run [Microsoft Bot Framework Emulator](https://github.com/Microsoft/BotFramework-Emulator/releases), open **what-time-bot.bot** file from this repo in emulator and enjoy.

## Example
<p align="center">
    <img alt="Bot" src="https://raw.githubusercontent.com/asc-lab/what-time-is-it-bot/master/readme-images/bot_example.gif" />
</p>
