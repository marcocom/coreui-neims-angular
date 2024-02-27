import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject, throwError } from 'rxjs';
import {
  catchError,
  take,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import * as L from 'leaflet';

import { snapshot } from '@app/utils';
import { Location } from '@api/types';
import { Environment } from '@core/types';
import { ENVIRONMENT } from '@core/providers';
import {
  LayerGisEvent,
  MapApiService,
  MapOptions,
  MapRegistryService,
  Markers,
} from '@shared/modules/leaflet';
import {
  LocationMarkerEventTypeEnum,
  LocationWizardStepEnum,
} from '@locations/enums';
import { LocationMarkerEvent } from '@locations/types';
import { LocationsDataService } from '@data/locations-data.service';
import { DialogUIService } from '@layout/services/dialog.service';

@Component({
  selector: 'aqm-locations',
  templateUrl: './locations.page.html',
  styleUrls: ['./locations.page.scss'],
})
export class LocationsPage implements OnInit, AfterViewInit, OnDestroy {
  private readonly locationsLayer = 'locations-layer';

  private readonly unsubscribe$ = new Subject();

  private prevIcon: Nullable<L.Icon | L.DivIcon> = null;
  private selectedLocation: Nullable<Location> = null;
  private mapApi: Nullable<MapApiService>;

  public markerAdded: boolean = false;
  public addLocationMode: boolean = true;
  public currentWizardStep!: LocationWizardStepEnum;

  public locations$ = this.locationsDataService.locations$;
  public viewType$ = this.locationsDataService.viewType$;
  public selectedLocation$ = this.locationsDataService.selectedLocation$;
  public selectedFilters$ = this.locationsDataService.locationsFilters$.pipe(
    take(1)
  );
  public loading$ = this.locationsDataService.loading$;

  public readonly options: MapOptions = {
    mapKey: this.locationsDataService.mapKey,
    tileServerUrl: this.env.mapConfig.tileServerUrl,
    attribution: this.env.mapConfig.attribution,
    center: [28.5, 35],
    zoom: 10,
  };

  constructor(
    @Inject(ENVIRONMENT) private env: Environment,
    private mapRegistry: MapRegistryService,
    private locationsDataService: LocationsDataService,
    private cdRef: ChangeDetectorRef,
    private dialogUIService: DialogUIService
  ) {}

  public ngOnInit(): void {
    this.locationsDataService.setSelectedLocation(null);
    this.locationsDataService.loadLocationsData(
      snapshot(this.locationsDataService.locationsFilters$)!
    );

    this.locationsDataService.locationDeleteEvent$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((locationId) => this.deleteLocation(locationId));
  }

  public ngAfterViewInit(): void {
    this.mapApi = this.mapRegistry.getApi(
      this.locationsDataService.mapKey
    ) as MapApiService;

    if (!this.mapApi) return;

    this.locationsDataService.locationsDataLoaded$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ geo, gisLocations }) => {
        this.mapApi?.removeLayer(this.locationsLayer);

        this.mapApi?.createLayer(this.locationsLayer, geo, {
          filter: (feature) => {
            const pid = String(feature.properties.pid);
            return !!gisLocations[pid];
          },
          pointLayerIcon: (props) => {
            const pid = String(props.pid);

            return gisLocations[pid].station
              ? Markers.marker2Icon
              : Markers.marker1Icon;
          },
        });
      });

    this.mapApi.layerEvent$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((event) => this.handleLayerEvent(event as LayerGisEvent));

    this.locationsDataService.locationMarkerEvent$
      .pipe(
        withLatestFrom(this.locationsDataService.loading$),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(([event, loading]) => {
        if (!loading) {
          this.handleLocationMarkerEvent(this.mapApi, event);
        }
      });
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public onMapInitialized(): void {
    this.locationsDataService.setMapInitializeStatus(true);
  }

  private handleLocationMarkerEvent(
    mapApi: Nullable<MapApiService>,
    event: LocationMarkerEvent
  ): void {
    const { action, pid, location } = event;
    const marker = mapApi?.getChildLayer<L.Marker>(
      this.locationsLayer,
      pid
    ) as L.Marker;

    if (!marker) return;

    if (action === LocationMarkerEventTypeEnum.Deselect) {
      this.selectedLocation = null;
      this.setLocationMarkerIcon('default', marker, location);
      return;
    }

    if (this.selectedLocation?.gisId === pid) return;

    switch (action) {
      case LocationMarkerEventTypeEnum.HighlightOn:
        this.prevIcon = this.setLocationMarkerIcon(
          'highlight',
          marker,
          location
        );
        break;
      case LocationMarkerEventTypeEnum.HighlightOff:
        if (this.prevIcon) {
          marker.setIcon(this.prevIcon);
          this.prevIcon = null;
        }
        break;
      case LocationMarkerEventTypeEnum.Select:
        if (this.selectedLocation) {
          // Restore previously selected marker
          const selectedMarker = mapApi?.getChildLayer<L.Marker>(
            this.locationsLayer,
            this.selectedLocation.gisId
          ) as L.Marker;

          if (selectedMarker) {
            this.setLocationMarkerIcon(
              'default',
              selectedMarker,
              this.selectedLocation
            );
          }
        }

        this.selectedLocation = location;

        this.setLocationMarkerIcon('select', marker, location);
        this.locationsDataService.setSelectedLocation(location.uuid);
        this.locationsDataService.setCurrentViewType('details');
        break;
    }
  }

  private handleLayerEvent(event: LayerGisEvent): void {
    switch (event.action) {
      case 'mouseover':
        this.locationsDataService.emitLocationMarkerEvent(
          LocationMarkerEventTypeEnum.HighlightOn,
          event.pid
        );
        break;
      case 'mouseout':
        this.locationsDataService.emitLocationMarkerEvent(
          LocationMarkerEventTypeEnum.HighlightOff,
          event.pid
        );
        break;
      case 'click':
        this.locationsDataService.emitLocationMarkerEvent(
          LocationMarkerEventTypeEnum.Select,
          event.pid
        );
        break;
    }
  }

  private setLocationMarkerIcon(
    mode: 'default' | 'highlight' | 'select' = 'default',
    marker: L.Marker,
    location: Location
  ): L.Icon | L.DivIcon {
    const prevIcon = marker.getIcon();
    const linked = !!location.station;
    let markerIcon: L.Icon | L.DivIcon;

    switch (mode) {
      case 'highlight':
        markerIcon = linked ? Markers.marker2AltIcon : Markers.marker1AltIcon;
        break;
      case 'select':
        markerIcon = Markers.customMarkerWithText(
          linked ? 'marker-2-alt' : 'marker-1-alt',
          location.name
        );
        break;
      default:
        markerIcon = linked ? Markers.marker2Icon : Markers.marker1Icon;
        break;
    }

    marker.setIcon(markerIcon);

    return prevIcon;
  }

  private deleteLocation(locationId: UUIDv4): void {
    this.dialogUIService.openConfirm({
      accept: () =>
        this.locationsDataService
          .deleteLocation(locationId)
          .pipe(catchError((err) => throwError(err)))
          .subscribe(
            (next) => {
              this.dialogUIService.openAlert({
                summary: $localize`:Delete location success toast title|:Location deleted`,
                detail: $localize`:Delete location success toast message|:The selected location has been deleted.`,
              });
              this.locationsDataService.loadLocationsData(
                snapshot(this.locationsDataService.locationsFilters$)!
              );
              this.locationsDataService.setCurrentViewType('list');
              this.deselectLocation();
            },
            (err) => {
              this.dialogUIService.openAlert({
                summary: $localize`:Delete location failure toast title|:An error occurred`,
                detail: $localize`:Delete location failure toast message|:Impossible deleting the location.`,
              });
              this.locationsDataService.setCurrentViewType('list');
              this.deselectLocation();
            }
          ),
      header: $localize`:Delete location dialog title|:You are deleting this location`,
      message: $localize`:Delete location dialog message|:This action is irreversible and you will delete the location and all its information.`,
      acceptLabel: $localize`:Delete location confirm button label|:Delete location`,
    });
  }

  private deselectLocation(): void {
    const selectedLocation = snapshot(
      this.locationsDataService.selectedLocation$
    );

    if (selectedLocation) {
      this.locationsDataService.setSelectedLocation(null);
      this.locationsDataService.emitLocationMarkerEvent(
        LocationMarkerEventTypeEnum.Deselect,
        selectedLocation.gisId
      );
    }
  }
}
