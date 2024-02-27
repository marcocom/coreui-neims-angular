import { InjectionToken } from '@angular/core';

import { environment } from 'src/environments/environment';

import { Environment } from '@core/types';

export const ENVIRONMENT = new InjectionToken<Environment>(
  'Environment configuration',
  {
    providedIn: 'root',
    factory: () => {
      return environment;
    },
  }
);
