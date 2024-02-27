import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  forkJoin,
  Observable,
  of,
  Subject,
} from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  finalize,
  map,
  pluck,
  switchMap,
  take,
} from 'rxjs/operators';

import { arrayToMap, dayjs, pick } from '@app/utils';
import { LocationVisibilityEnum } from '@api/enums';
import {
  Capability,
  Location,
  LocationsFilters,
  Metrics,
  MetricsFilters,
  Station,
} from '@api/types';
import { StationService, DataService } from '@api/services';
import { LocationData, MapData, MapFilters } from '@map/types';

@Injectable({
  providedIn: 'root',
})
export class MapDataService {
  private _locations$ = new BehaviorSubject<Location[]>([]);
  private _locationIdMap$ = new BehaviorSubject<Record<UUIDv4, Location>>({});
  private _gisLocations$ = new BehaviorSubject<Record<string, Location>>({});

  private _capabilities$ = new BehaviorSubject<Capability[]>([]);
  private _capabilityNameMap$ = new BehaviorSubject<Record<string, Capability>>(
    {}
  );
  private _metricKeyMap$ = new BehaviorSubject<Record<string, Capability>>({});

  private _metricsPerLocation$ = new BehaviorSubject<Record<string, Metrics>>(
    {}
  );
  private _metrics$ = new BehaviorSubject<Metrics[]>([]);

  private _mapFilters$ = new BehaviorSubject<MapFilters>(
    this.getDefaultMapFilters()
  );

  private _mapDataLoaded$ = new Subject<MapData>();

  private _loading$ = new BehaviorSubject<boolean>(false);
  private _lastUpdate$ = new BehaviorSubject<Nullable<string>>(null);

  /**
   * Get all locations
   */
  public get locations$(): Observable<Location[]> {
    return this._locations$.asObservable();
  }

  /**
   * Get location by id
   */
  public get locationIdMap$(): Observable<Record<UUIDv4, Location>> {
    return this._locationIdMap$.asObservable();
  }

  /**
   * Used to obtain the location object for a specific GIS pid
   */
  public get gisLocations$(): Observable<Record<string, Location>> {
    return this._gisLocations$.asObservable();
  }

  /**
   * Get all available station capabilities
   */
  public get capabilities$(): Observable<Capability[]> {
    return this._capabilities$.asObservable();
  }

  /**
   * Get capability by name
   */
  public get capabilityNameMap$(): Observable<Record<string, Capability>> {
    return this._capabilityNameMap$.asObservable();
  }

  /**
   * Used to obtain the capability object for a specific metric key
   */
  public get metricKeyMap$(): Observable<Record<string, Capability>> {
    return this._metricKeyMap$.asObservable();
  }

  /**
   * Used to obtain the aggregated metrics for a specific station serial number
   */
  public get metricsPerLocation$(): Observable<Record<string, Metrics>> {
    return this._metricsPerLocation$.asObservable();
  }

  /**
   * Get metrics
   */
  public get metrics$(): Observable<Metrics[]> {
    return this._metrics$.asObservable();
  }

  /**
   * Get applied filters
   */
  public get mapFilters$(): Observable<MapFilters> {
    return this._mapFilters$.asObservable();
  }

  /**
   * Get dateFrom filter value
   */
  public get dateFromFilter$(): Observable<string> {
    return this.mapFilters$.pipe(pluck('dateFrom'), distinctUntilChanged());
  }

  /**
   * Get dateTo filter value
   */
  public get dateToFilter$(): Observable<string> {
    return this.mapFilters$.pipe(pluck('dateTo'), distinctUntilChanged());
  }

  /**
   * Get defaultDateRange filter value
   */
  public get defaultDateRange$(): Observable<boolean> {
    return this.mapFilters$.pipe(
      pluck('defaultDateRange'),
      distinctUntilChanged()
    );
  }

  /**
   * Get capabilities filter value
   */
  public get capabilitiesFilter$(): Observable<string[]> {
    return this.mapFilters$.pipe(pluck('capabilities'), distinctUntilChanged());
  }

  /**
   * Get locations filter value
   */
  public get locationsFilter$(): Observable<UUIDv4[]> {
    return this.mapFilters$.pipe(pluck('locations'), distinctUntilChanged());
  }

  /**
   * Check if any filters have been applied
   */
  public get defaultMapFilters$(): Observable<boolean> {
    return this.mapFilters$.pipe(
      map(({ locations, capabilities, defaultDateRange }) => {
        return !locations.length && !capabilities.length && defaultDateRange;
      }),
      distinctUntilChanged()
    );
  }

  /**
   * Event emitted when the map data is loaded
   */
  public get mapDataLoaded$(): Observable<MapData> {
    return this._mapDataLoaded$.asObservable();
  }

  /**
   * Get loading status
   */
  public get loading$(): Observable<boolean> {
    return this._loading$.asObservable().pipe(distinctUntilChanged());
  }

  /**
   * Get last update date
   */
  public get lastUpdate$(): Observable<Nullable<string>> {
    return this._lastUpdate$.asObservable().pipe(distinctUntilChanged());
  }

  constructor(
    private stationService: StationService,
    private dataService: DataService
  ) {}

  /**
   * Get location by id
   * @param uuid location id
   */
  public getLocation(uuid: UUIDv4): Observable<Nullable<Location>> {
    if (this._locationIdMap$.value[uuid]) {
      return of(this._locationIdMap$.value[uuid]);
    }

    this._loading$.next(true);

    return this.stationService.getLocationById(uuid).pipe(
      finalize(() => {
        this._loading$.next(false);
      }),
      catchError(() => of(null))
    );
  }

  /**
   * Get data for location tooltip
   * @param pid GIS pid
   */
  public getLocationData(pid: string): Observable<Nullable<LocationData>> {
    return combineLatest([
      this.gisLocations$,
      this.metricsPerLocation$,
      this.mapFilters$,
    ]).pipe(
      map(([gisLocations, metricsPerLocation, filters]) => {
        const location = gisLocations[pid];

        if (!location) return null;

        const { name, uuid } = location;

        return {
          name,
          uuid,
          metrics: location.station
            ? metricsPerLocation[location.station.serialNumber] ?? null
            : null,
          filters,
        };
      })
    );
  }

  /**
   * Load all locations
   */
  public fetchLocations(): void {
    this.stationService
      .getLocations({
        visibility: LocationVisibilityEnum.Published,
      })
      .subscribe((res) => {
        this._locationIdMap$.next(arrayToMap(res.content, 'uuid'));
        this._locations$.next(res.content);
      });
  }

  /**
   * Load all capabilities
   */
  public fetchCapabilities(): void {
    this.stationService.getCapabilities().subscribe((capabilities) => {
      this._capabilityNameMap$.next(arrayToMap(capabilities, 'name'));
      this._metricKeyMap$.next(arrayToMap(capabilities, 'metricKey'));
      this._capabilities$.next(capabilities);
    });
  }

  /**
   * Load map data
   * @param filters map filters
   */
  public loadMapData(
    filters: Partial<LocationsFilters & MetricsFilters> = {}
  ): void {
    const { dateFrom, dateTo } = this.getDefaultMapFilters();
    const fromDate = filters.fromDate ?? dateFrom;
    const toDate = filters.toDate ?? dateTo;
    const defaultDateRange = !(filters.fromDate || filters.toDate);

    this._mapFilters$.next({
      dateFrom: fromDate,
      dateTo: toDate,
      defaultDateRange,
      capabilities: filters.capabilities ?? [],
      locations: filters.locationIds ?? [],
    });

    this._loading$.next(true);

    forkJoin([
      this.stationService.getLocationsGeo(),
      this.loadMetricsPerLocation({
        ...filters,
        fromDate,
        toDate,
      }),
    ])
      .pipe(
        finalize(() => {
          this._loading$.next(false);
        })
      )
      .subscribe(([geo, { locations, metrics }]) => {
        this._lastUpdate$.next(dayjs().toISOString());

        const gisLocations = arrayToMap(locations, 'gisId');
        const metricsPerLocation = arrayToMap(metrics, 'serialNumber');

        this._gisLocations$.next(gisLocations);
        this._metricsPerLocation$.next(metricsPerLocation);

        this._mapDataLoaded$.next({
          geo,
          gisLocations,
          metricsPerLocation,
        });
      });
  }

  /**
   * Load metrics for a specific station serial number
   * @param serialNumber station serial number
   */
  public loadMetrics(serialNumber: string): void {
    if (!this._capabilities$.value.length) {
      this.fetchCapabilities();
    }

    this._loading$.next(true);

    this.mapFilters$
      .pipe(
        switchMap(({ dateFrom: fromDate, dateTo: toDate, capabilities }) => {
          const filters: Partial<MetricsFilters> = {
            fromDate,
            toDate,
            serialNumbers: [serialNumber],
          };

          if (capabilities.length) {
            filters.capabilities = capabilities;
          }

          return this.dataService.getMetrics(filters);
        }),
        take(1)
      )
      .subscribe((metrics) => {
        this._loading$.next(false);
        this._metrics$.next(metrics);
      });
  }

  private loadMetricsPerLocation(
    filters: Partial<LocationsFilters & MetricsFilters> = {}
  ): Observable<{
    locations: Location[];
    metrics: Metrics[];
  }> {
    return this.stationService
      .getFilteredLocations(
        pick(filters as LocationsFilters, ['locationIds', 'capabilities'])
      )
      .pipe(
        switchMap((locations) => {
          const linkedLocations = locations.filter(
            (location) => location.station
          );

          if (!linkedLocations.length) {
            return of({
              locations,
              metrics: [],
            });
          }

          return this.dataService
            .getAggregatedMetrics({
              ...pick(filters as MetricsFilters, [
                'fromDate',
                'toDate',
                'capabilities',
              ]),
              serialNumbers: linkedLocations.map(
                (location) => (location.station as Station).serialNumber
              ),
            })
            .pipe(map((metrics) => ({ locations, metrics })));
        })
      );
  }

  private getDefaultMapFilters(): MapFilters {
    const now = dayjs();

    return {
      dateFrom: now.subtract(30, 'day').toISOString(),
      dateTo: now.toISOString(),
      defaultDateRange: true,
      capabilities: [],
      locations: [],
    };
  }
}
