import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  template: `
    <h2>لوحة التحكم والتحليلات</h2>
    <p>عدد الحقول: {{ totalFields }}</p>
    <p>إجمالي الإنتاج: {{ totalProduction }} برميل/يوم</p>
    <p>متوسط الإنتاج: {{ averageProduction.toFixed(2) }} برميل/يوم</p>
    <p>إجمالي تكلفة الصيانة: {{ totalCost.toLocaleString() }} دولار</p>

    <canvas id="productionChart"></canvas>
    <canvas id="maintenanceChart"></canvas>
  `
})
export class DashboardComponent implements OnInit {
  totalFields = 0;
  totalProduction = 0;
  averageProduction = 0;
  totalCost = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:5000/api/condensatefields')
      .subscribe(data => {
        this.totalFields = data.length;
        this.totalProduction = data.reduce((sum, f) => sum + f.productionRate, 0);
        this.averageProduction = this.totalProduction / this.totalFields;
        this.totalCost = data.reduce((sum, f) => sum + parseFloat(f.cost.replace(/[^0-9.-]+/g, '')), 0);

        const fieldNames = data.map(f => f.fieldName);
        const productionRates = data.map(f => f.productionRate);

        const maintenanceTypes: { [key: string]: number } = {};
        data.forEach(f => {
          maintenanceTypes[f.maintenanceType] = (maintenanceTypes[f.maintenanceType] || 0) + 1;
        });

        new Chart("productionChart", {
          type: 'bar',
          data: {
            labels: fieldNames,
            datasets: [{
              label: 'الإنتاج اليومي',
              data: productionRates,
              backgroundColor: 'rgba(54, 162, 235, 0.5)'
            }]
          }
        });

        new Chart("maintenanceChart", {
          type: 'pie',
          data: {
            labels: Object.keys(maintenanceTypes),
            datasets: [{
              label: 'نوع الصيانة',
              data: Object.values(maintenanceTypes),
              backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(255, 159, 64, 0.5)',
                'rgba(255, 205, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)',
                'rgba(201, 203, 207, 0.5)'
              ]
            }]
          }
        });
      });
  }
}