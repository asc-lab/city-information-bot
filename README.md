# What time is it?
Chatbot that can answer the question: "What time is in Chicago (or any other city)"?

This bot is build with [**Bot Builder SDK (Microsoft Bot Framework) v3**](https://github.com/Microsoft/BotBuilder).

# Extra features
Application is integrated with http://history.openweathermap.org and is now able to provide you with weather information about selected city.

## Prerequisites
* A Google maps api key. Currently google cloud account have a free trial (this might change). Learn how to get started with [**Google documentation**](https://developers.google.com/maps/documentation/javascript/get-api-key).
* Geocoding Api and Time Zone API in your google cloud account should be enabled.
* An Open Weather Map api key. You can get it for free on [**Open Weather Map home website**](https://home.openweathermap.org/users/sign_in).
* ```.env``` file based on ```.env-example```. You should replace YOUR_KEY with your google cloud api key and YOUR_WEATHER_KEY with Open Weather Map api key.
```
MICROSOFT_APP_ID=
MICROSOFT_APP_PASSWORD=

MOCK_BACKEND=false

GEOCODE_API_URL=https://maps.googleapis.com/maps/api/geocode/json?address=REPLACE_THIS&key=YOUR_KEY
TIMEZONE_API_URL=https://maps.googleapis.com/maps/api/timezone/json?location=REPLACE_THIS&key=YOUR_KEY
OPENWEATHERMAP_GEOMETRY_URL = https://api.openweathermap.org/data/2.5/weather?REPLACE_THIS&appid=YOUR_WEATHER_KEY&units=metric
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
