import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FinanciationService {
  private http = inject(HttpClient);
  private API_URL = window?.COHACER_API_URL || 'http://cohacer.localhost:4000';

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
