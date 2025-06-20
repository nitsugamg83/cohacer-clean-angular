import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {
  private API_URL = environment.apiUrl;
  private headers = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {}

  enviarDatosEnvio(data: {
    enrollId: string;
    method: string;
    tracking: {
      number: string;
      name: string;
    };
  }): Observable<any> {
    const url = `${this.API_URL}/api/enroll/${data.enrollId}/shipment`;

    console.log('📦 Enviando POST a:', url);
    console.log('📝 Body:', JSON.stringify(data, null, 2));

    return this.http.post<any>(url, data, {
      headers: this.headers
    });
  }
}
