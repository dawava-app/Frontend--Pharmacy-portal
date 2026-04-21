import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './core/interceptors/token.interceptor';
import { InjectionToken } from '@angular/core';
import { environment } from '../environments/environment';
export const API_URL = new InjectionToken<string>('API_URL', { factory: () => environment.apiUrl });

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: API_URL, useValue: environment.apiUrl },
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors([tokenInterceptor])),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    })
  ],
};
