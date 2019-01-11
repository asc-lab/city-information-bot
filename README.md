# What time is it and what is the weather like?

Chatbot that can answer the question: "What time is it and what is the weather like (or any other city)"?

This bot is build with [**Bot Builder SDK (Microsoft Bot Framework) v4**](https://github.com/Microsoft/BotBuilder).

On branch [**botbuilder-v3**](https://github.com/asc-lab/what-time-is-it-bot/tree/botbuilder-v3) is the version using **Bot Builder SDK (Microsoft Bot Framework) v3**.

## New version feature

The first version of the bot could shown only hour in a selected city.
Thanks integration with `http://history.openweathermap.org` is now able to provide you with weather information about selected city.

## Prerequisites

* A Google maps api key. Currently google cloud account have a free trial (this might change). Learn how to get started with [**Google documentation**](https://developers.google.com/maps/documentation/javascript/get-api-key).
* Geocoding Api and Time Zone API in your google cloud account should be enabled.
* An Open Weather Map api key. You can get it for free on [**Open Weather Map home website**](https://home.openweathermap.org/users/sign_in).
* ```.env``` file based on ```.env-example```. You should replace `YOUR_KEY` with your google cloud api key and `YOUR_WEATHER_KEY` with Open Weather Map api key.
```
botFilePath="./city-information-bot.bot"
botFileSecret=""

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
Run [Microsoft Bot Framework Emulator](https://github.com/Microsoft/BotFramework-Emulator/releases), open **city-information-bot.bot** file from this repo in emulator and enjoy.

## Example

<p align="center">
    <img alt="Bot" src="https://raw.githubusercontent.com/asc-lab/what-time-is-it-bot/master/readme-images/bot_with_weather.gif" />
</p>
