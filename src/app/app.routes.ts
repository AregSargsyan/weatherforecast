import { Routes } from '@angular/router';
import { WeatherChartComponent } from './weather-chart/weather-chart.component';

export const routes: Routes = [
  { path: 'weather/:id', component: WeatherChartComponent },
];
