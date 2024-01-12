import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";

@Component({
  selector: 'app-lcc-plot',
  templateUrl: './lcc-plot.component.html',
  styleUrls: ['./lcc-plot.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LccPlotComponent implements OnInit {

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July'
    ],
    datasets: [
      {
        data: [ 65, 59, 80, 81, 56, 55, 40 ],
        label: 'Series A',
        // fill: true,
        tension: 0.5,
        // borderColor: 'black',
        // backgroundColor: 'rgba(0, 0, 0, 0)'
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false,
    scales: {
      x: {
        display: false,
        grid: {
          display: false,
        }
      },
      y: {
        display: false,
        grid: {
          display: false,
        }
      }
    }
  };
  public lineChartLegend = false;

  ngOnInit(): void {
    this.build()
  }

  private build() {
  }

}
