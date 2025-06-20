import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnrollService {
  private API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      })
    };
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.API_URL}/api/enroll/me`, this.getAuthHeaders());
  }

  getEvaluator(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/api/evaluator/${id}`, this.getAuthHeaders());
  }

  getDocumentChecks(): Observable<any> {
    return this.http.get(`${this.API_URL}/api/documentChecks`, this.getAuthHeaders());
  }

  getMyDocuments(enrollId: string): Observable<any> {
    return this.http.get(`${this.API_URL}/api/document/enroll/${enrollId}`, this.getAuthHeaders());
  }

  uploadDocument(formData: FormData): Observable<any> {
    return this.http.post(`${this.API_URL}/api/document/upload`, formData, this.getAuthHeaders());
  }
 
 getMyEnrollments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/api/v2/enroll/my-enrollments`, this.getAuthHeaders());
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/api/v2/enroll/${id}`, this.getAuthHeaders());
  }
}
