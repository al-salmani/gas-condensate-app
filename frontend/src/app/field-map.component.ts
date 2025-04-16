import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-field-map',
  template: '<div id="map" style="height: 500px;"></div>'
})
export class FieldMapComponent implements AfterViewInit {

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    const map = L.map('map').setView([21.5, 55.5], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // أيقونة مخصصة
    const customIcon = L.icon({
	  //iconUrl: 'assets/leaflet/marker-icon.png',
      iconUrl: 'assets/leaflet/gas-marker.png',
	  iconRetinaUrl: 'assets/leaflet/gas-marker-2x.png',
	  shadowUrl: 'assets/leaflet/marker-shadow.png',
      iconSize: [30, 40],
      iconAnchor: [15, 40],
      popupAnchor: [0, -40]
    });

    this.http.get<any[]>('http://localhost:5000/api/condensatefields')
      .subscribe(fields => {
        console.log('✅ الحقول:', fields);
        fields.forEach(field => {
          const lat = parseFloat(field.latitude);
          const lng = parseFloat(field.longitude);
          if (!isNaN(lat) && !isNaN(lng)) {
            const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
            marker.bindPopup(`
              <strong>${field.fieldName}</strong><br>
              الإنتاج: ${field.productionRate} برميل/يوم<br>
              الصيانة: ${field.maintenanceType}
            `);
          }
        });
      }, error => {
        console.error('❌ فشل تحميل الحقول:', error);
      });
  }
}