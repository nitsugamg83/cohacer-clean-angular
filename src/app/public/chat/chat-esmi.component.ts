import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-chat-esmi',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './chat-esmi.component.html',
  styleUrls: ['./chat-esmi.component.scss']
})
export class ChatEsmiComponent {
  message = '';
  messages: { sender: 'user' | 'esmi'; text: string }[] = [
    { sender: 'esmi', text: 'Hola soy Esmi y estoy aquí para ayudarte con tus dudas.' }
  ];
  loading = false;

  suggestions: string[] = [
    '¿Cómo compruebo mi experiencia?',
    '¿Cuánto cuesta el proceso?',
    '¿Cómo es el proceso?',
    '¿Cómo son los pagos?',
    '¿Qué carrera podría tomar?',
    '¿Cómo puedo inscribirme?'
  ];

  constructor(private http: HttpClient) {}

  sendMessage() {
    const text = this.message.trim();
    if (!text) return;

    this.messages.push({ sender: 'user', text });
    this.message = '';
    this.loading = true;

    this.http
      .post<{ message: any }>(`${environment.apiUrl}/api/asva/esmi`, { question: text })
      .subscribe({
        next: (res) => {
          this.messages.push({ sender: 'esmi', text: res.message.content });
          this.loading = false;
        },
        error: () => {
          this.messages.push({ sender: 'esmi', text: 'Ocurrió un error al contactar al servidor.' });
          this.loading = false;
        }
      });
  }

  sendSuggestion(suggestion: string) {
    this.message = suggestion;
    this.sendMessage();
  }
}
