import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  template: `
    <h2>لوحة التحكم والتحليلات</h2>

    <div style="margin-bottom: 1rem;">
      <label>نوع الصيانة:</label>
      <select [(ngModel)]="selectedMaintenance" (change)="applyFilters()">
        <option value="">الكل</option>
        <option *ngFor="let type of maintenanceTypesList" [value]="type">{{ type }}</option>
      </select>

      <label>سنة الاستخراج:</label>
      <select [(ngModel)]="selectedYear" (change)="applyFilters()">
        <option value="">الكل</option>
        <option *ngFor="let y of yearsList" [value]="y">{{ y }}</option>
      </select>
    </div>

    <p>عدد الحقول: {{ filteredFields.length }}</p>
    <p>إجمالي الإنتاج: {{ totalProduction }} برميل/يوم</p>
    <p>متوسط الإنتاج: {{ averageProduction.toFixed(2) }} برميل/يوم</p>
    <p>إجمالي تكلفة الصيانة: {{ totalCost.toLocaleString() }} دولار</p>

    <canvas #productionChart></canvas>
    <canvas #maintenanceChart></canvas>
  `
})
export class DashboardComponent implements AfterViewInit {
  @ViewChild('productionChart') productionChartRef!: ElementRef;
  @ViewChild('maintenanceChart') maintenanceChartRef!: ElementRef;

  allFields: any[] = [];
  filteredFields: any[] = [];

  totalProduction = 0;
  averageProduction = 0;
  totalCost = 0;

  selectedMaintenance = '';
  selectedYear = '';

  maintenanceTypesList: string[] = [];
  yearsList: number[] = [];

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.http.get<any[]>('/api/condensatefields')
      .subscribe({
        next: data => {
        this.allFields = data;
        this.maintenanceTypesList = [...new Set(data.map(f => f.maintenanceType))] as string[];
        this.yearsList = [...new Set(data.map(f => f.yearOfExtraction))] as number[];
        this.applyFilters();
        console.log('✅ البيانات المستلمة:', data);
      },
      error: err => {
        console.error('❌ فشل جلب البيانات:', err);
      }

      });


  }

  applyFilters(): void {
    this.filteredFields = this.allFields.filter(f =>
      (!this.selectedMaintenance || f.maintenanceType === this.selectedMaintenance) &&
      (!this.selectedYear || f.yearOfExtraction === +this.selectedYear)
    );

    this.totalProduction = this.filteredFields.reduce((sum, f) => sum + f.productionRate, 0);
    this.averageProduction = this.filteredFields.length ? this.totalProduction / this.filteredFields.length : 0;
    this.totalCost = this.filteredFields.reduce((sum, f) => sum + Number(f.cost), 0);

    const fieldNames = this.filteredFields.map(f => f.fieldName);
    const productionRates = this.filteredFields.map(f => f.productionRate);

    const maintenanceTypes: { [key: string]: number } = {};
    this.filteredFields.forEach(f => {
      maintenanceTypes[f.maintenanceType] = (maintenanceTypes[f.maintenanceType] || 0) + 1;
    });

    new Chart(this.productionChartRef.nativeElement, {
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

    new Chart(this.maintenanceChartRef.nativeElement, {
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
  }
}