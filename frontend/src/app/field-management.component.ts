import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AuthService } from './auth.service';


@Component({
  selector: 'app-field-management',
  template: `
    <h2>إدارة الحقول</h2>
    <div>
      <button (click)="exportToExcel()">📊 تصدير إلى Excel</button>
      <button (click)="exportToPDF()">📄 تصدير إلى PDF</button>
    </div>
    <table *ngIf="fields.length > 0">
      <thead>
        <tr>
          <th>الاسم</th>
          <th>الإحداثيات</th>
          <th>الإنتاج</th>
          <th>التكلفة</th>
          <th>السنة</th>
          <th>الصيانة</th>
          <th>الإجراءات</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let field of fields">
          <td><a (click)="goToMap(field)">{{ field.fieldName }}</a></td>
          <td>{{ field.latitude }}, {{ field.longitude }}</td>
          <td *ngIf="canEditProduction"><input [(ngModel)]="field.productionRate" (blur)="updateField(field)" /></td>
          <td *ngIf="!canEditProduction">{{ field.productionRate }}</td>
          <td>{{ field.cost }}</td>
          <td>{{ field.yearOfExtraction }}</td>
          <td *ngIf="canEditMaintenance"><input [(ngModel)]="field.maintenanceType" (blur)="updateField(field)" /></td>
          <td *ngIf="!canEditMaintenance">{{ field.maintenanceType }}</td>
          <td>
            <button *ngIf="isAdmin" (click)="deleteField(field.id)">🗑 حذف</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div *ngIf="isAdmin" class="add-field-form">
  <h3>➕ إضافة حقل جديد</h3>
  <form (ngSubmit)="addField()">
    <input [(ngModel)]="newField.fieldName" name="name" placeholder="اسم الحقل" required />
    <input [(ngModel)]="newField.latitude" name="lat" placeholder="Latitude" required type="number" />
    <input [(ngModel)]="newField.longitude" name="lng" placeholder="Longitude" required type="number" />
    <input [(ngModel)]="newField.productionRate" name="prod" placeholder="الإنتاج" required type="number" />
    <input [(ngModel)]="newField.cost" name="cost" placeholder="التكلفة" required />
    <input [(ngModel)]="newField.yearOfExtraction" name="year" placeholder="سنة الاستخراج" required />
    <input [(ngModel)]="newField.maintenanceType" name="maint" placeholder="نوع الصيانة" required />
    <button type="submit">إضافة</button>
  </form>
</div>

  `
})
export class FieldManagementComponent implements OnInit {
  fields: any[] = [];
  userName: string = '';
  userRole: string = '';
  userToken: string = '';

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userToken = this.authService.getToken();
    this.userName = localStorage.getItem('name');
    this.userRole = localStorage.getItem('role');
    this.loadFields();
    console.log('🧪 التوكن', this.userToken);
    console.log('🧪 التوكن المجزأ', JSON.parse(atob(localStorage.getItem('token').split('.')[1])));
    console.log('🧪 اسم المستخدم', this.userName);
    console.log('🧪  الصلاحية:', this.userRole);

  }

  get isAdmin(): boolean {
    return this.userRole === 'Admin';
  }

  get canEditProduction(): boolean {
    return this.userRole === 'Admin' || this.userRole === 'Operator';
  }

  get canEditMaintenance(): boolean {
    return this.userRole === 'Admin' || this.userRole === 'Engineer';
  }

  loadFields(): void {
    this.http.get<any[]>('/api/condensatefields')
      .subscribe(data => this.fields = data);
  }

  newField = {
    fieldName: '',
    latitude: '',
    longitude: '',
    productionRate: '',
    cost: '',
    yearOfExtraction: '',
    maintenanceType: ''
  };
  
  addField(): void {
    this.http.post('/api/condensatefields', this.newField)
      .subscribe(() => {
        this.loadFields();  // إعادة تحميل البيانات
        this.newField = {  // إعادة ضبط النموذج
          fieldName: '',
          latitude: '',
          longitude: '',
          productionRate: '',
          cost: '',
          yearOfExtraction: '',
          maintenanceType: ''
        };
      });
  }


  updateField(field: any): void {
    this.http.put('/api/condensatefields/' + field.id, field)
      .subscribe(() => console.log('✅ تم التحديث'));
  }

  deleteField(id: number): void {
    if (confirm('هل أنت متأكد من حذف هذا الحقل؟')) {
      this.http.delete('/api/condensatefields/' + id)
        .subscribe(() => this.loadFields());
    }
  }

  exportToExcel(): void {
    const worksheet = XLSX.utils.json_to_sheet(this.fields);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Fields');
    XLSX.writeFile(workbook, 'fields.xlsx');
  }

  exportToPDF(): void {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['الاسم', 'الإحداثيات', 'الإنتاج', 'التكلفة', 'السنة', 'الصيانة']],
      body: this.fields.map(f => [
        f.fieldName,
        f.latitude + ', ' + f.longitude,
        f.productionRate,
        f.cost,
        f.yearOfExtraction,
        f.maintenanceType
      ])
    });
    doc.save('fields.pdf');
  }

  goToMap(field: any): void {
    this.router.navigate(['/field-map'], {
      queryParams: {
        lat: field.latitude,
        lng: field.longitude,
        name: field.fieldName,
        production: field.productionRate,
        maintenance: field.maintenanceType 
      }
    });
  }
}