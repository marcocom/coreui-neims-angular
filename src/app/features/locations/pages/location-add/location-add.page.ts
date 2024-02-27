import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, throwError } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import * as L from 'leaflet';

import { Location } from '@api/types';
import { snapshot } from '@app/utils';
import { ENVIRONMENT } from '@core/providers';
import { Environment } from '@core/types';
import { LocationsDataService } from '@data/locations-data.service';
import { DialogUIService } from '@layout/services/dialog.service';
import { LocationWizardStepEnum } from '@locations/enums';
import {
  LayerGisEvent,
  MapApiService,
  MapOptions,
  MapRegistryService,
  Markers,
} from '@shared/modules/leaflet';

const SET_LOCATION_MARKER: L.MarkerOptions = {
  icon: Markers.marker1AltIcon,
  draggable: true,
};

@Component({
  selector: 'aqm-location-add-page',
  templateUrl: './location-add.page.html',
  styleUrls: ['./location-add.page.scss'],
})
export class LocationAddPage implements OnInit {
  public currentWizardStep: LocationWizardStepEnum =
    LocationWizardStepEnum.SetCoordinates;
  public markerAdded: boolean = false;
  public addLocationMode: boolean = false;
  public locationData: Partial<Location> = {};

  public readonly options: MapOptions = {
    mapKey: this.locationsDataService.mapKey,
    tileServerUrl: this.env.mapConfig.tileServerUrl,
    attribution: this.env.mapConfig.attribution,
    center: [28.5, 35],
    zoom: 10,
  };

  private mapApi!: MapApiService;
  private mapNode!: HTMLElement;

  private readonly locationsLayer = 'locations-layer';
  private readonly newLocationLayer = 'new-location-layer';

  private readonly unsubscribe$ = new Subject();

  constructor(
    @Inject(ENVIRONMENT) private env: Environment,
    private mapRegistry: MapRegistryService,
    private locationsDataService: LocationsDataService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    public dialogUIService: DialogUIService
  ) {}

  public ngOnInit(): void {
    this.locationsDataService.loadLocationsData(
      snapshot(this.locationsDataService.locationsFilters$)!
    );

    this.locationsDataService.newLocationData$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: Partial<Location>) => (this.locationData = data));
  }

  public ngAfterViewInit(): void {
    const map = this.mapRegistry.getMap(
      this.locationsDataService.mapKey
    ) as L.Map;
    this.mapApi = this.mapRegistry.getApi(
      this.locationsDataService.mapKey
    ) as MapApiService;

    this.mapNode = L.DomUtil.get('aqm-map') as HTMLElement;

    if (!this.mapApi) return;

    this.locationsDataService.locationsDataLoaded$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ geo, gisLocations }) => {
        this.mapApi.removeLayer(this.locationsLayer);

        this.mapApi.createLayer(this.locationsLayer, geo, {
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

    this.mapNode = L.DomUtil.get('aqm-map') as HTMLElement;
    // to specify event handler on map in general, not layer
    map.on('click', this.addLocationByClick, this);
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public onMapInitialized(): void {
    this.locationsDataService.setMapInitializeStatus(true);
  }

  public onStoreLocationData(locationData: Partial<Location>): void {
    this.locationsDataService.setNewLocationData({
      ...this.locationData,
      ...locationData,
    });
  }

  public onSetCurrentStep(step: LocationWizardStepEnum): void {
    this.currentWizardStep = step;

    const {
      latitude: lat,
      longitude: lng,
      name,
    } = this.locationData as Location;
    const coordinates: L.LatLngExpression = [+lat, +lng];
    const icon = Markers.customMarkerWithText('marker-1-alt', name);
    let markerOptions: L.MarkerOptions;

    switch (this.currentWizardStep) {
      case LocationWizardStepEnum.SetCoordinates:
        markerOptions = SET_LOCATION_MARKER;
        break;
      case LocationWizardStepEnum.DataForm:
        markerOptions = { icon: Markers.marker1AltIcon };
        break;
      case LocationWizardStepEnum.Confirmation:
        markerOptions = { icon };
        break;
    }

    this.mapApi.removeLayer(this.newLocationLayer);
    this.mapApi.createMarkerLayer(
      this.newLocationLayer,
      coordinates,
      markerOptions
    );
  }

  public toggleAddMode(event: any): void {
    // to avoid placing marker immediately after button click
    event.stopPropagation();
    this.addLocationMode = true;
  }

  public onNavigateBack(): void {
    this.resetState();
  }

  public onAddLocation(): void {
    this.locationsDataService
      .createLocation(this.locationData)
      .pipe(catchError((err) => throwError(err)))
      .subscribe(
        (next) => {
          this.dialogUIService.openAlert({
            summary: $localize`:Add location success toast title|:New Location added`,
            detail: $localize`:Add location success toast message|:Your location has been successfully added.`,
          });
          this.locationsDataService.loadLocationsData(
            snapshot(this.locationsDataService.locationsFilters$)!
          );
          this.resetState();
        },
        (err) => {
          this.dialogUIService.openAlert({
            summary: $localize`:Add location failure toast title|:An error occurred`,
            detail: $localize`:Add location failure toast message|:Impossible to add the location.`,
          });
          this.resetState();
        }
      );
  }

  private resetState(): void {
    this.mapApi?.removeLayer(this.newLocationLayer);
    this.locationsDataService.setNewLocationData({});
    this.locationsDataService.setCurrentViewType('list');
    this.router.navigate(['/locations']);
  }

  private handleLayerEvent(event: LayerGisEvent): void {
    if (event.action !== 'dragend') return;

    this.setMarkerLocation(event.props);
  }

  private setMarkerLocation(coordinates: L.LatLng): void {
    const { lat, lng } = coordinates;

    this.onStoreLocationData({
      latitude: String(lat),
      longitude: String(lng),
    });
  }

  private addLocationByClick(event: L.LeafletMouseEvent): void {
    if (!this.mapApi) return;

    if (this.addLocationMode && !this.markerAdded) {
      this.mapApi.createMarkerLayer(
        this.newLocationLayer,
        event?.latlng,
        SET_LOCATION_MARKER
      );
      this.addLocationMode = false;
      this.markerAdded = true;
      this.cdRef.detectChanges();
      this.setMarkerLocation(event?.latlng);
    }
  }
}
