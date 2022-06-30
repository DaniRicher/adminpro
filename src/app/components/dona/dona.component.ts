import { Component, Input } from '@angular/core';
import { ChartData, Color } from 'chart.js';


@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent  {
  
  @Input() titulo: string = 'Sin titulo';

  constructor() {  }
  @Input('labels') doughnutChartLabels: string[] = [ 'Label1', 'Label2', 'Label3' ];
  @Input('data') doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      {
        data: [ 350, 450, 100 ],
        backgroundColor: ['#6857E6','#009FEE','#F02059'],
      },
    ]
  };
  

}
