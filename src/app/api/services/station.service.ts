import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ENVIRONMENT } from '@core/providers';
import {
  Capability,
  Location,
  LocationsFilters,
  LocationsParams,
  Pageable,
  PageParams,
  QueryParams,
} from '@api/types';
import { ApiHttpService } from '@api/services/api-http.service';

@Injectable({
  providedIn: 'root',
  useFactory: () => {
    // Inject API url in ApiHttpService when the gateway will be implemented
    const httpClient = inject(HttpClient);
    const env = inject(ENVIRONMENT);

    return new StationService(
      new ApiHttpService(env.stationsServiceUrl, httpClient)
    );
  },
})
export class StationService {
  constructor(private apiHttpService: ApiHttpService) {}

  public addLocation(options: Partial<Location>): Observable<Location> {
    return this.apiHttpService
      .post<Location>('locations', options)
      .pipe(map((res) => res.body as Location));
  }

  public editLocation(location: Location): Observable<Location> {
    return this.apiHttpService
      .put<Location>(`locations/${location.uuid}`, location)
      .pipe(map((res) => res.body as Location));
  }

  public getLocations(
    params: Partial<LocationsParams & PageParams> = {}
  ): Observable<Pageable<Location>> {
    return this.apiHttpService
      .get<Pageable<Location>>(
        'locations',
        new HttpParams({
          fromObject: params as QueryParams,
        })
      )
      .pipe(map((res) => res.body as Pageable<Location>));
  }

  public getLocationById(locationId: UUIDv4): Observable<Nullable<Location>> {
    return this.apiHttpService
      .get<Location>(`locations/${locationId}`)
      .pipe(map((res) => res.body));
  }

  public deleteLocation(locationId: UUIDv4): Observable<Location> {
    return this.apiHttpService.delete<Location>(`locations/${locationId}`);
  }

  public getCapabilities(): Observable<Capability[]> {
    return this.apiHttpService
      .get<Capability[]>('stations/capabilities')
      .pipe(map((res) => res.body ?? []));
  }

  public getLocationsGeo(): Observable<GeoJSON> {
    return this.apiHttpService
      .get<any>('gis/get_geojson_collection')
      .pipe(map((res) => res.body?.[0]?.jsonb_build_object ?? null));
  }

  public getFilteredLocations(
    filters: Partial<LocationsFilters> = {}
  ): Observable<Location[]> {
    return this.apiHttpService
      .post<Pageable<Location>>('locations/filter', filters)
      .pipe(map((res) => res.body?.content ?? []));
  }
}
