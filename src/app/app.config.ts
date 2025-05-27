import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; 
import { routes } from './app.routes';

/**
 * Declaración global para permitir window.COHACER_API_URL
 */
declare global {
  interface Window {
    COHACER_API_URL: string;
  }
}

/**
 * Exporta la URL base de la API, obtenida desde window o con fallback local
 */
export const API_URL = window.COHACER_API_URL || 'http://cohacer.localhost:4000';

export const appConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient() // 
  ]
};
