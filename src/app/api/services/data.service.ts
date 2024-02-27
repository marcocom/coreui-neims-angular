import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ENVIRONMENT } from '@core/providers';
import { MetricsFilters, Metrics } from '@api/types';
import { ApiHttpService } from '@api/services/api-http.service';

@Injectable({
  providedIn: 'root',
  useFactory: () => {
    // Inject API url in ApiHttpService when the gateway will be implemented
    const httpClient = inject(HttpClient);
    const env = inject(ENVIRONMENT);

    return new DataService(new ApiHttpService(env.dataServiceUrl, httpClient));
  },
})
export class DataService {
  constructor(private apiHttpService: ApiHttpService) {}

  public getMetrics(
    filters: Partial<MetricsFilters> = {}
  ): Observable<Metrics[]> {
    return this.apiHttpService
      .post<Metrics[]>('metrics', filters)
      .pipe(map((res) => res.body ?? []));
  }

  public getAggregatedMetrics(
    filters: Partial<MetricsFilters> = {}
  ): Observable<Metrics[]> {
    return this.apiHttpService
      .post<Metrics[]>('metrics/aggregate', filters)
      .pipe(map((res) => res.body ?? []));
  }
}
