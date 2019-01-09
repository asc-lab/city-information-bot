require('dotenv-extended').load();
const request = require('request');
const GEOCODE_API_URL = process.env.GEOCODE_API_URL;
const TIMEZONE_API_URL = process.env.TIMEZONE_API_URL;
const OPENWEATHERMAP_GEOMETRY_URL = process.env.OPENWEATHERMAP_GEOMETRY_URL;

function getTime(city) {
    return _getGeoFor(city).then(function (geometry) {
        return _getTimeFor(geometry);
    });
}

function getWeather(city) {
    return _getGeoFor(city).then(function (geometry) {
        return _getWeatherFor(geometry);
    });
}


function _getGeoFor(city) {
    return new Promise(function (resolve, reject) {
        let geoUrl = GEOCODE_API_URL.replace('REPLACE_THIS', city);
        request({
                method: 'GET',
                uri: geoUrl,
                headers: {
                    'content-type': 'application/json'
                }
            },
            function (error, response, body) {
                if (error) {
                    reject(error);
                } else {
                    resolve(JSON.parse(body).results[0]);
                }
            }
        );
    });
}

function _getTimeFor(geoInfo) {
    return new Promise(function (resolve, reject) {
        let location = geoInfo.geometry.location.lat + "," + geoInfo.geometry.location.lng;
        let zoneUrl = TIMEZONE_API_URL.replace('REPLACE_THIS', location);

        request({
                method: 'GET',
                uri: zoneUrl,
                headers: {
                    'content-type': 'application/json'
                }
            },
            function (error, response, body) {
                if (error) {
                    reject(error);
                } else {
                    let time = new Date().toLocaleString('pl', {timeZone: JSON.parse(body).timeZoneId});
                    console.log(time);
                    resolve(time);
                }
            }
        );
    });
}


function _getWeatherFor(geoInfo) {
    return new Promise(function (resolve, reject) {
        let location = "lat=" + geoInfo.geometry.location.lat + "&lon=" + geoInfo.geometry.location.lng;
        let weatherUrl = OPENWEATHERMAP_GEOMETRY_URL.replace('REPLACE_THIS', location);
        request({
                method: 'GET',
                uri: weatherUrl,
                headers: {
                    'content-type': 'application/json'
                }
            },
            function (error, response, body) {
                if (error) {
                    reject(error);
                } else {
                    let weatherInfo = JSON.parse(body);
                    console.log(weatherInfo);
                    console.log(toString(weatherInfo));
                    resolve(toString(weatherInfo));
                }
            }
        );
    });
}

function toString(weatherInfo) {

    const msg = "\n\r Minimum temperature in the city is MIN_TEMP °C " +
        "\n\r Maximum temperature in the city is MAX_TEMP °C " +
        "\n\r Preassure is PREASS hPa " +
        "\n\r Humididy is HUMID % " +
        "\n\r Wind speed is WIND_SPEED m/s " +
        "\n\r Wind direction is WIND_DIR ° " +
        "\n\r Cloudiness is CLOUDI % ";
    return msg
        .replace("MIN_TEMP", weatherInfo.main.temp_min)
        .replace("MAX_TEMP", weatherInfo.main.temp_max)
        .replace("PREASS", weatherInfo.main.temp_max)
        .replace("HUMID", weatherInfo.main.humidity)
        .replace("WIND_SPEED", weatherInfo.wind.speed)
        .replace("WIND_DIR", weatherInfo.wind.deg)
        .replace("CLOUDI", weatherInfo.clouds.all);
}

module.exports = {
    getTimeFor: getTime,
    getWeather: getWeather
};
