import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FinanciationService {
  private API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUnfinanced(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/api/enroll/unfinanced`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  submitFinancing(id: string, data: any): Observable<any> {
    return this.http.put(`${this.API_URL}/api/enroll/${id}/financiate`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
  }
}
