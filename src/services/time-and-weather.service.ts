import * as request from 'request';
import {ITimeAndWeatherService} from './i-time-and-weather.service';
import {TimeAndWeatherResponse} from './time-and-weather.response';

export class TimeAndWeatherService implements ITimeAndWeatherService {

    public getTimeFor(city: string): Promise<string> {
        return this._getGeoFor(city).then((geometry) => {
            console.log(geometry);
            return this._getTimeFor(geometry);
        });
    }

    public getWeatherFor(city: string): Promise<string> {
        return this._getGeoFor(city).then((geometry) => {
            return this._getWeatherFor(geometry);
        });
    }

    public getTimeAndWeatherFor(city: string): Promise<TimeAndWeatherResponse> {
        return this._getGeoFor(city).then((geometry) => {
        const promises = [this._getTimeFor(geometry), this._getWeatherFor(geometry)];
        return Promise.all(promises).then((results: string[]) => {
                return new TimeAndWeatherResponse(results[0], results[1]);
            },
            (reason) => {
                console.log(reason);
                return new TimeAndWeatherResponse('', '' );
            });
        });
    }

    private _getGeoFor(city: string): Promise<any> { // FIXME declare a response
        const geoUrl = process.env.GEOCODE_API_URL.replace('REPLACE_THIS', city);
        return new Promise((resolve, reject) => {
            return request.get(
                geoUrl,
                {
                    headers: {'content-type': 'application/json'}
                },
                (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(JSON.parse(body).results[0]);
                    }
                }
            );
        });
    }

    private _getTimeFor(geoInfo: any): Promise<string> {
        const location = geoInfo.geometry.location.lat + ',' + geoInfo.geometry.location.lng;
        const zoneUrl = process.env.TIMEZONE_API_URL.replace('REPLACE_THIS', location);
        return new Promise((resolve, reject) => {
            return request.get(
                zoneUrl,
                {
                    headers: {'content-type': 'application/json'}
                },
                (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        const time = new Date().toLocaleString('pl', JSON.parse(body).timeZoneId);
                        resolve(time);
                    }
                }
            );
        });
    }

    private _getWeatherFor(geoInfo: any): Promise<string> {
        const location = 'lat=' + geoInfo.geometry.location.lat + '&lon=' + geoInfo.geometry.location.lng;
        const weatherUrl = process.env.OPENWEATHERMAP_GEOMETRY_URL.replace('REPLACE_THIS', location);
        return new Promise((resolve, reject) => {
            return request.get(
                weatherUrl,
                {
                    headers: {'content-type': 'application/json'}
                },
                (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        const weatherInfo = JSON.parse(body); // FIXME define this object (also method toString should be on it)
                        resolve(this.toString(weatherInfo));
                    }
                }
            );
        });
    }

    private toString(weatherInfo: any): string {
        const msg = '\n\r Minimum temperature in the city is MIN_TEMP °C ' +
            '\n\r Maximum temperature in the city is MAX_TEMP °C ' +
            '\n\r Preassure is PREASS hPa ' +
            '\n\r Humididy is HUMID % ' +
            '\n\r Wind speed is WIND_SPEED m/s ' +
            '\n\r Wind direction is WIND_DIR ° ' +
            '\n\r Cloudiness is CLOUDI % ';
        return msg
            .replace('MIN_TEMP', weatherInfo.main.temp_min)
            .replace('MAX_TEMP', weatherInfo.main.temp_max)
            .replace('PREASS', weatherInfo.main.temp_max)
            .replace('HUMID', weatherInfo.main.humidity)
            .replace('WIND_SPEED', weatherInfo.wind.speed)
            .replace('WIND_DIR', weatherInfo.wind.deg)
            .replace('CLOUDI', weatherInfo.clouds.all);
    }

}
