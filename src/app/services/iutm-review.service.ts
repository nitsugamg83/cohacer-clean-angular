import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PDFDocument } from 'pdf-lib';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getReviews(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/api/enroll/evaluatoriutm/review`, { headers });
  }

  acceptReview(data: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/api/enroll/evaluatoriutm/review`, { _id: data._id, status: 'Aceptado' }, { headers });
  }

  rejectReview(data: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/api/enroll/evaluatoriutm/review`, data, { headers });
  }

  async generatePDF(item: any): Promise<void> {
    const pdfDoc = await PDFDocument.create();

    for (const file of item.documents.files) {
      try {
        if (!file?.url) {
          console.warn("Archivo sin URL válida", file);
          continue;
        }

        const fileData = await fetch(`${this.apiUrl}/api/file/download?file=${file.url}`).then(res => res.arrayBuffer());
        const filePDF = await PDFDocument.load(fileData);
        const pagesToCopy = filePDF.getPages();
        const indexes = pagesToCopy.map((_, index: number) => index);
        const copiedPages = await pdfDoc.copyPages(filePDF, indexes);
        copiedPages.forEach(page => pdfDoc.addPage(page));
      } catch (e) {
        console.error("Error al agregar PDF:", e, file);
      }
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.user.name}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      'Content-Type': 'application/json'
    });
  }
}
