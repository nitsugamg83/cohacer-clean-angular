import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CasoPracticoService {
  private API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private get headers(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getUser(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/api/v2/user/me`, { headers: this.headers });
  }

  getEnroll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/api/enroll/me`, { headers: this.headers });
  }

  getPracticalCase(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/api/practicalcase/me`, { headers: this.headers });
  }

  savePortada(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/api/practicalcase/portada`, data, { headers: this.headers });
  }

  saveSection(practicalCaseId: string, sectionId: string, body: any): Observable<any> {
    const url = `${this.API_URL}/api/practicalcase/${practicalCaseId}/section/${sectionId}`;
    return this.http.put(url, body, { headers: this.headers });
  }

  requestSectionReview(practicalCaseId: string, sectionId: string, body: any): Observable<any> {
    return this.http.put(`${this.API_URL}/api/practicalcase/${practicalCaseId}/section/${sectionId}/review`, body, { headers: this.headers });
  }

  returnToWorking(practicalCaseId: string, sectionId: string, body: any): Observable<any> {
    return this.http.put(`${this.API_URL}/api/practicalcase/${practicalCaseId}/section/${sectionId}/return`, body, { headers: this.headers });
  }

  deleteSection(practicalCaseId: string, sectionId: string, body: any): Observable<any> {
    return this.http.request('DELETE', `${this.API_URL}/api/practicalcase/${practicalCaseId}/section/${sectionId}`, {
      body,
      headers: this.headers
    });
  }

  moveSection(practicalCaseId: string, sectionId: string, direction: string, subsection?: string): Observable<any> {
    return this.http.put(`${this.API_URL}/api/practicalcase/${practicalCaseId}/section/${sectionId}/subsection/${subsection}/move`, {
      direction,
      subsection
    }, {
      headers: this.headers
    });
  }

  crearProceso(data: { processLevel: string; processCareer?: string }): Observable<any> {
    const url = `${this.API_URL}/api/enroll/autoenroll`;
    return this.http.post<any>(url, data, { headers: this.headers });
  }

  revisarTexto(data: { text: string; suggestion?: string }): Observable<any> {
    const url = `${this.API_URL}/api/asva/review`;
    return this.http.post<any>(url, data, { headers: this.headers });
  }

  renameSubsection(practicalCaseId: string, sectionId: string, subsectionId: string, newName: string): Observable<any> {
    const url = `${this.API_URL}/api/practicalcase/${practicalCaseId}/section/${sectionId}/subsection/${subsectionId}/rename`;
    return this.http.put(url, { name: newName }, { headers: this.headers });
  }

}
