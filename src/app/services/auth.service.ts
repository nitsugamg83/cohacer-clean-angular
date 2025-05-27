import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URL } from '../app.config';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = API_URL;

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${this.baseUrl}/api/v2/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getUserByEmail(email: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/v2/user/byEmail/${encodeURIComponent(email)}`);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/v2/user/passworLogin`, { email, password }).pipe(
      switchMap((loginResponse) => {
        const token = loginResponse?.token;
        if (!token) throw new Error('No se recibió token del servidor');

        localStorage.setItem('token', token);
        localStorage.setItem('redirectUrl', loginResponse.redirect || '/app');

        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`
        });

        return this.http.get<any>(`${this.baseUrl}/api/v2/user/me`, { headers }).pipe(
          map((user) => {
            localStorage.setItem('user', JSON.stringify(user));
            return user;
          })
        );
      })
    );
  }

  sendOtp(email: string, requestNewPassword: boolean): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/v2/user/mailOTP`, {
      email,
      requestNewPassword
    });
  }

  verifyOtp(email: string, code: string, password?: string): Observable<any> {
    const payload: any = { email, code };
    if (password) payload.password = password;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${this.baseUrl}/api/v2/user/verifyOTP`, payload, { headers });
  }

}
