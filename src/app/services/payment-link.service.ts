import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentLinkService {
  private API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPaymentLinks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/api/enroll/paymentLinks`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
}
