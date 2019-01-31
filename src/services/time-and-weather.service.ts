import * as request from 'request';
import {ITimeAndWeatherService} from './i-time-and-weather.service';
import {TimeAndWeatherResponse} from './time-and-weather.response';
import {Weather} from '../model/Weather';

export class TimeAndWeatherService implements ITimeAndWeatherService {

    public async getTimeFor(city: string): Promise<string> {
        const geometry = await this._getGeoFor(city);
        return this._getTimeFor(geometry);
    }

    public async getWeatherFor(city: string): Promise<string> {
        const geometry = await this._getGeoFor(city);
        return this._getWeatherFor(geometry);
    }

    public async getTimeAndWeatherFor(city: string): Promise<TimeAndWeatherResponse> {
        const geometry = await this._getGeoFor(city);

        const promises = [
            this._getTimeFor(geometry),
            this._getWeatherFor(geometry)
        ];

        return Promise.all(promises).then(
            (results: string[]) => {
                return new TimeAndWeatherResponse(results[0], results[1]);
            },
            (reason) => { // error
                console.log(reason);
                return new TimeAndWeatherResponse('', '');
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
                        const time = new Date().toLocaleString('en', {timeZone: JSON.parse(body).timeZoneId});
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
                        const weather: Weather = Object.assign(new Weather(), JSON.parse(body));
                        resolve(weather.printInfo());
                    }
                }
            );
        });
    }
}
