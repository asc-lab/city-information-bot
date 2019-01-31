export class Weather implements IWeather {
    public clouds: IClouds;
    public main: IMain;
    public weather: IWeatherEntity[] | null;
    public wind: IWind;

    public printInfo = (): string => {
        const msg =
            '\n\r Main info: WEATHER_MAIN ' +
            '\n\r Better description: WEATHER_DESCRIPTION ' +
            '\n\r ------------------' +
            '\n\r Current temperature is CURRENT_TEMP °C ' +
            '\n\r Minimum today temperature is MIN_TEMP °C ' +
            '\n\r Maximum today temperature is MAX_TEMP °C ' +
            '\n\r ------------------' +
            '\n\r Pressure is PRESSURE_HPA hPa ' +
            '\n\r Humidity is HUMID % ' +
            '\n\r Wind speed is WIND_SPEED m/s ' +
            '\n\r Wind direction is WIND_DIR ° ' +
            '\n\r Cloudiness is CLOUDI % ';

        return msg
            .replace('WEATHER_MAIN', this.weather && this.weather.length > 0 ? this.weather[0].main : 'UNDEFINED')
            .replace('WEATHER_DESCRIPTION', this.weather && this.weather.length > 0 ? this.weather[0].description : 'UNDEFINED')
            .replace('CURRENT_TEMP', this.main.temp ? this.main.temp.toString() : 'UNDEFINED')
            .replace('MIN_TEMP', this.main.temp_min ? this.main.temp_min.toString() : 'UNDEFINED')
            .replace('MAX_TEMP', this.main.temp_max ? this.main.temp_max.toString() : 'UNDEFINED')
            .replace('PRESSURE_HPA', this.main.pressure ? this.main.pressure.toString() : 'UNDEFINED')
            .replace('HUMID', this.main.humidity ? this.main.humidity.toString() : 'UNDEFINED')
            .replace('WIND_SPEED', this.wind.speed ? this.wind.speed.toString() : 'UNDEFINED')
            .replace('WIND_DIR', this.wind.deg ? this.wind.deg.toString() : 'UNDEFINED')
            .replace('CLOUDI', this.clouds.all ? this.clouds.all.toString() : 'UNDEFINED');
    }
}

export interface IWeather {
    weather?: IWeatherEntity[] | null;
    main: IMain;
    wind: IWind;
    clouds: IClouds;
}

export interface IWeatherEntity {
    id: number;
    main: string;
    description: string;
    icon: string;
}

export interface IMain {
    temp: number;
    pressure: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
}

export interface IWind {
    speed: number;
    deg: number;
}

export interface IClouds {
    all: number;
}
