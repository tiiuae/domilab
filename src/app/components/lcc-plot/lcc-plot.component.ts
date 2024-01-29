import { AfterViewInit, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";

@Component({
  selector: 'app-lcc-plot',
  templateUrl: './lcc-plot.component.html',
  styleUrls: ['./lcc-plot.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LccPlotComponent implements AfterViewInit {

  @Input('datasets') datasets: any;
  showPlot: boolean = false

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
  public lineChartLegend = true;

  ngAfterViewInit(): void {
    // console.log(this.datasets);
    this.build()
  }

  private build() {
    var labels = []
    var numNodes = this.datasets[0].data.length
    for (let index = 0; index < numNodes; index++) {
      labels.push(index)
    }

    this.lineChartData.datasets = this.datasets.map((e: any) => {
      console.log(e);

      return {
        data: e['data'],
        label: e['label'],
        // fill: true,
        tension: 0.5,
        // borderColor: 'black',
        // backgroundColor: 'rgba(0, 0, 0, 0)'
      }
    })
    this.lineChartData.labels = labels
    console.log(this.lineChartData);
    this.showPlot = true
  }

}
