export class TimeAndWeatherResponse {

    constructor(private _time: string, private _weather: string) { }

    get time(): string {
        return this._time;
    }

    get weather(): string {
        return this._weather;
    }
}
