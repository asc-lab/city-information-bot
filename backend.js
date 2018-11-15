require('dotenv-extended').load();
const request = require('request');
const GEOCODE_API_URL = process.env.GEOCODE_API_URL;
const TIMEZONE_API_URL = process.env.TIMEZONE_API_URL;

function getTime(city) {
    return _getGeoFor(city).then(function (geometry) {
        return _getTimeFor(geometry);
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

module.exports = {
    getTimeFor: getTime
};
