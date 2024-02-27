import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  forkJoin,
  Observable,
  Subject,
} from 'rxjs';
import { distinctUntilChanged, finalize, map } from 'rxjs/operators';

import { arrayToMap } from '@app/utils';
import { Location, LocationsParams } from '@api/types';
import { StationService } from '@api/services';
import {
  LocationMarkerEventTypeEnum,
  LocationWizardStepEnum,
} from '@locations/enums';
import {
  LocationMarkerEvent,
  LocationsData,
  LocationsFilters,
  LocationsViewType,
} from '@locations/types';

@Injectable({
  providedIn: 'root',
})
export class LocationsDataService {
  public readonly mapKey = 'map-locations';

  private _displayCustomMapControl$ = new BehaviorSubject<boolean>(false);
  private _viewType$ = new BehaviorSubject<LocationsViewType>('list');
  private _locations$ = new BehaviorSubject<Location[]>([]);
  private _locationIdMap$ = new BehaviorSubject<Record<UUIDv4, Location>>({});
  private _gisLocations$ = new BehaviorSubject<Record<string, Location>>({});
  private _selectedLocation$ = new BehaviorSubject<Nullable<UUIDv4>>(null);
  private _locationsDataLoaded$ = new Subject<LocationsData>();
  private _isMapInitialized$ = new BehaviorSubject<boolean>(false);
  private _locationMarkerEvent$ = new Subject<LocationMarkerEvent>();
  private _newLocationData$ = new BehaviorSubject<Partial<Location>>({});
  private _currentWizardStep$ = new BehaviorSubject<LocationWizardStepEnum>(
    LocationWizardStepEnum.SetCoordinates
  );
  private _locationCreatedEvent$ = new Subject<void>();
  private _locationEditedEvent$ = new Subject<void>();
  private _locationDeleteEvent$ = new Subject<UUIDv4>();
  private _locationsFilters$ = new BehaviorSubject<LocationsFilters>({
    locationType: null,
    visibility: null,
    linking: null,
  });
  private _loading$ = new BehaviorSubject<boolean>(false);

  /**
   * Gets a hint to display or not custom map control
   */
  public get displayCustomMapControl$(): Observable<boolean> {
    return this._displayCustomMapControl$.asObservable();
  }

  /**
   * Get current sidebar view type
   */
  public get viewType$(): Observable<LocationsViewType> {
    return this._viewType$.asObservable().pipe(distinctUntilChanged());
  }

  /**
   * Get all locations
   */
  public get locations$(): Observable<Location[]> {
    return this._locations$.asObservable().pipe(distinctUntilChanged());
  }

  /**
   * Notify when location was edited
   */
  public get locationEditedEvent$(): Observable<void> {
    return this._locationEditedEvent$.asObservable();
  }

  /**
   * Get selected location
   */
  public get selectedLocation$(): Observable<Nullable<Location>> {
    return combineLatest([this._locationIdMap$, this._selectedLocation$]).pipe(
      map(([locationIdMap, selectedLocation]) =>
        selectedLocation ? locationIdMap[selectedLocation] ?? null : null
      )
    );
  }

  /**
   * Event emitted when the locations data is loaded
   */
  public get locationsDataLoaded$(): Observable<LocationsData> {
    return this._locationsDataLoaded$.asObservable();
  }

  /**
   * Get map loading state
   */
  public get isMapInitialized$(): Observable<boolean> {
    return this._isMapInitialized$.asObservable();
  }

  /**
   * Emits location marker event
   */
  public get locationMarkerEvent$(): Observable<LocationMarkerEvent> {
    return this._locationMarkerEvent$.asObservable();
  }

  /**
   * Get data for location creation
   */
  public get newLocationData$(): Observable<Partial<Location>> {
    return this._newLocationData$.asObservable();
  }

  /**
   * Get locations filters
   */
  public get locationsFilters$(): Observable<LocationsFilters> {
    return this._locationsFilters$.asObservable();
  }

  /**
   * Get loading status
   */
  public get loading$(): Observable<boolean> {
    return this._loading$.asObservable().pipe(distinctUntilChanged());
  }

  /**
   * Get current wizard step
   */
  public get currentWizardStep$(): Observable<LocationWizardStepEnum> {
    return this._currentWizardStep$.asObservable();
  }

  /**
   * Emits an event on attempt to delete location
   */
  public get locationDeleteEvent$(): Observable<UUIDv4> {
    return this._locationDeleteEvent$.asObservable();
  }

  constructor(private stationService: StationService) {}

  /**
   * Set a flag to display or not custom control on the map
   * @param displayControl display control indicator
   */
  public displayCustomMapControl(displayControl: boolean): void {
    this._displayCustomMapControl$.next(displayControl);
  }

  /**
   * Set sidebar view type
   * @param viewType sidebar view type
   */
  public setCurrentViewType(viewType: LocationsViewType): void {
    this._viewType$.next(viewType);
  }

  /**
   * Set selected location
   * @param uuid location id
   */
  public setSelectedLocation(uuid: Nullable<UUIDv4>): void {
    this._selectedLocation$.next(uuid);
  }

  /**
   * Change map status
   * @param status map is loading indicator
   */
  public setMapInitializeStatus(status: boolean): void {
    this._isMapInitialized$.next(status);
  }

  /**
   * Load locations data
   * @param filters locations filters
   */
  public loadLocationsData(filters: LocationsFilters): void {
    const params: Partial<LocationsParams> = {};

    if (filters?.locationType) {
      params.type = filters.locationType;
    }

    if (filters?.visibility) {
      params.visibility = filters.visibility;
    }

    if (filters && filters.linking !== null) {
      params.hasLinkedStations = filters.linking;
    }

    this._locationsFilters$.next(filters);
    this._loading$.next(true);

    forkJoin([
      this.stationService.getLocationsGeo(),
      this.stationService.getLocations(params),
    ])
      .pipe(
        finalize(() => {
          this._loading$.next(false);
        })
      )
      .subscribe(([geo, locations]) => {
        const locationIdMap = arrayToMap(locations.content, 'uuid');
        const gisLocations = arrayToMap(locations.content, 'gisId');

        this._locationIdMap$.next(locationIdMap);
        this._gisLocations$.next(gisLocations);
        this._locations$.next(locations.content);
        this._locationsDataLoaded$.next({ geo, gisLocations });
      });
  }

  /**
   * Emit location marker event
   * @param action event action
   * @param pid GIS pid
   */
  public emitLocationMarkerEvent(
    action: LocationMarkerEventTypeEnum,
    pid: string
  ): void {
    const location = this._gisLocations$.value[pid];

    if (!location) return;

    this._locationMarkerEvent$.next({
      action,
      pid,
      location,
    });
  }

  /**
   * Sets data for new location
   * @param params add location data
   */
  public setNewLocationData(params: Partial<Location>): void {
    this._newLocationData$.next(params);
  }

  /**
   * Creates new location
   * @param options new location data
   */
  public createLocation(options: Partial<Location>): Observable<Location> {
    return this.stationService.addLocation(options);
  }

  /**
   * Edit exist location
   * @param location new location data
   */
  public editLocation(location: Location): void {
    this.stationService.editLocation(location).subscribe(() => {
      this._locationEditedEvent$.next();
    });
  }

  /**
   * Emits event when marker placed
   * @param location location to delete
   */
  public emitLocationDeleteEvent(locationId: UUIDv4): void {
    this._locationDeleteEvent$.next(locationId);
  }

  /**
   * Triggers when is marker placement mode
   * @param addMode indicates addMode status
   */
  public setCurrentWizardStep(step: LocationWizardStepEnum): void {
    this._currentWizardStep$.next(step);
  }

  /**
   * executes location delete
   * @param locationId id of location to delete
   */
  public deleteLocation(locationId: UUIDv4): Observable<Location> {
    return this.stationService.deleteLocation(locationId);
  }
}
