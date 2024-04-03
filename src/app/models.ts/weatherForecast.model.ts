export interface WeatherForecastResponse {
  properties: WeatherForecastProperties;
}
export interface WeatherForecastProperties {
  periods: ForecastPeriod[];
}

export interface ForecastPeriod {
  number: number;
  name: string;
  startTime: string;
  endTime: string;
  isDaytime: boolean;
  temperature: number;
  temperatureUnit: string;
  windSpeed: string;
  windDirection: string;
  shortForecast: string;
  detailedForecast: string;
}
