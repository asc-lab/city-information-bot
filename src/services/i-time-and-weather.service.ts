import {TimeAndWeatherResponse} from './time-and-weather.response';

export interface ITimeAndWeatherService {

    getTimeFor(city: string): Promise<string>;

    getWeatherFor(city: string): Promise<string>;

    getTimeAndWeatherFor(city: string): Promise<TimeAndWeatherResponse>;
}
