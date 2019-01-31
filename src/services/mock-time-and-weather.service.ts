import {ITimeAndWeatherService} from './i-time-and-weather.service';
import {TimeAndWeatherResponse} from './time-and-weather.response';

export class MockTimeAndWeatherService implements ITimeAndWeatherService {

    public getTimeAndWeatherFor(city: string): Promise<TimeAndWeatherResponse> {
        const promises = [this.getTimeFor(city), this.getWeatherFor(city)];
        return Promise.all(promises).then(
            (results: string[]) => {
                console.log(results);
                return new TimeAndWeatherResponse(results[0], results[1]);
            },
            (reason) => {
                console.log(reason);
                return new TimeAndWeatherResponse('', '');
            });
    }

    public getTimeFor(city: string): Promise<string> {
        console.log(`Getting time for ${city}`);
        return new Promise((resolve) => resolve(new Date().toLocaleDateString('pl')));
    }

    public getWeatherFor(city: string): Promise<string> {
        console.log(`Getting weather for ${city}`);
        return new Promise((resolve) => resolve('The weather is always fine'));
    }

}
