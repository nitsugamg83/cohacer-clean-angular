import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CasoPracticoService {
  private API_URL = environment.apiUrl;
  private headers = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {}

  getUser(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/api/v2/user/me`, { headers: this.headers });
  }

  getEnroll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/api/enroll/me`, { headers: this.headers });
  }

  getPracticalCase(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/api/practicalcase/me`, { headers: this.headers });
  }

  updatePracticalCase(practicalCaseId: string, sectionId: string, body: any): Observable<any> {
    const url = `${this.API_URL}/api/practicalcase/${practicalCaseId}/section/${sectionId}`;
    return this.http.put(url, body, { headers: this.headers });
  }

  crearProceso(data: { processLevel: string, processCareer?: string }): Observable<any> {
    const url = `${this.API_URL}/api/enroll/autoenroll`;
    return this.http.post<any>(url, data, { headers: this.headers });
  }

  revisarTexto(data: { text: string, suggestion?: string }): Observable<any> {
    const url = `${this.API_URL}/api/asva/review`;
    return this.http.post<any>(url, data, { headers: this.headers });
  }
}
