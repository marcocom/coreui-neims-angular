import { InjectionToken } from '@angular/core';

import { WebStorage } from './web-storage';

export const LOCAL_STORAGE = new InjectionToken<WebStorage>('LocalStorage', {
  providedIn: 'root',
  factory: () => {
    return new WebStorage(localStorage);
  },
});

export const SESSION_STORAGE = new InjectionToken<WebStorage>(
  'SessionStorage',
  {
    providedIn: 'root',
    factory: () => {
      return new WebStorage(sessionStorage);
    },
  }
);

export const WINDOW = new InjectionToken<Window>('Browser global object', {
  providedIn: 'root',
  factory: () => {
    return window;
  },
});
