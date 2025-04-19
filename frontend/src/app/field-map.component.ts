import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-field-map',
  template: '<div id="map" style="height: 500px;"></div>'
})
export class FieldMapComponent implements AfterViewInit {

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

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

    this.route.queryParams.subscribe(params => {
      const lat = parseFloat(params['lat']);
      const lng = parseFloat(params['lng']);
      const name = params['name'];
      const production = params['production'];
      const maintenance = params['maintenance'];
  
      if (!isNaN(lat) && !isNaN(lng)) {
        const marker = L.marker([lat, lng]).addTo(map);
        marker.bindPopup(`  <strong>${name}</strong><br>
              الإنتاج: ${production} برميل/يوم<br>
              الصيانة: ${maintenance}`).openPopup();
        map.setView([lat, lng], 10);

        // تعطيل المسارات الافتراضية
    delete (L.Icon.Default.prototype as any)._getIconUrl;

      }
    });
    

    this.http.get<any[]>('/api/condensatefields')
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