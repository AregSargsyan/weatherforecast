import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WeatherForecastResponse } from './models.ts/weatherForecast.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) { }

  getForecast(areaId: string) {
    const endpoint = `https://api.weather.gov/gridpoints/${areaId}/31,80/forecast`;
    return this.http.get<WeatherForecastResponse>(endpoint);
  }
}
