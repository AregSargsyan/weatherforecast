import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { switchMap } from 'rxjs';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-weather-chart',
  standalone: true,
  templateUrl: './weather-chart.component.html',
  styleUrl: './weather-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherChartComponent implements OnInit {
  @ViewChild('weatherChart') weatherChart!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;
  isLoading: boolean = true;

  constructor(
    private weatherService: WeatherService,
    private route: ActivatedRoute
  ) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.route.params.pipe(
      switchMap(params => {
        const areaId = params['id'];
        return this.weatherService.getForecast(areaId)
      }),
    ).subscribe(data => {
      const periods = data.properties.periods;
      const labels = periods.map(period => new Date(period.startTime).toLocaleDateString());
      const temps = periods.map(period => period.temperature);
      const additionalData = periods.map(period => ({
        description: period.shortForecast,
        windSpeed: period.windSpeed
      }));

      this.updateChart(labels, temps, additionalData);
    }
    );
  }

  getEmptyChartData() {
    return {
      labels: [],
      temps: [],
      additionalData: []
    };
  }

  updateChart(labels: string[], temps: number[], additionalData: {
    description: string;
    windSpeed: string;
  }[]) {
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart(this.weatherChart.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Temperature',
          backgroundColor: 'rgb(75, 192, 192)',
          borderColor: 'rgb(75, 192, 192)',
          data: temps,
          fill: false,
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Temperature (°F)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {

                const index = context.dataIndex;
                const data = additionalData[index];
                let tooltipText = `Temperature: ${context.parsed.y}°F`;
                if (data) {
                  tooltipText += `\nDescription: ${data.description}`;
                  tooltipText += `\nWind Speed: ${data.windSpeed}`;
                }
                return tooltipText;
              }
            }
          }
        }
      }
    });
  }
}
