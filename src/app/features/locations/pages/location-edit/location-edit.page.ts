import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import * as L from 'leaflet';

import { ENVIRONMENT } from '@core/providers';
import { Environment } from '@core/types';
import { Location } from '@api/types';
import { snapshot } from '@app/utils';
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

@Component({
  selector: 'aqm-location-edit-page',
  templateUrl: './location-edit.page.html',
  styleUrls: ['./location-edit.page.scss'],
})
export class LocationEditPage implements OnInit, AfterViewInit, OnDestroy {
  public currentWizardStep: LocationWizardStepEnum =
    LocationWizardStepEnum.SetCoordinates;
  public locationData!: Partial<Location>;

  public readonly options: MapOptions = {
    mapKey: this.locationsDataService.mapKey,
    tileServerUrl: this.env.mapConfig.tileServerUrl,
    attribution: this.env.mapConfig.attribution,
    center: [28.5, 35],
    zoom: 10,
  };

  private mapApi!: MapApiService;
  private activeMarker!: L.Marker;

  private readonly locationsLayer = 'locations-layer';
  private readonly newLocationLayer = 'new-location-layer';

  private readonly unsubscribe$ = new Subject();

  constructor(
    @Inject(ENVIRONMENT) private env: Environment,
    private mapRegistry: MapRegistryService,
    private locationsDataService: LocationsDataService,
    private dialogUIService: DialogUIService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.locationsDataService.loadLocationsData(
      snapshot(this.locationsDataService.locationsFilters$)!
    );

    this.locationsDataService.newLocationData$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: Partial<Location>) => {
        if (!data.gisId) {
          this.router.navigate(['/locations']);
          return;
        }
        this.locationData = data;
      });

    this.locationsDataService.locationEditedEvent$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.dialogUIService.openAlert({
          summary: $localize`:Edit location success message title|:Location updated`,
          detail: $localize`:Edit location success message body|:Your location information has been successfully updated.`,
        });
        this.resetState();
      });
  }

  public ngAfterViewInit(): void {
    this.mapApi = this.mapRegistry.getApi(
      this.locationsDataService.mapKey
    ) as MapApiService;

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

        this.activeMarker = this.mapApi?.getChildLayer<L.Marker>(
          this.locationsLayer,
          this.locationData.gisId
        ) as L.Marker;
        this.onSetCurrentStep(LocationWizardStepEnum.DataForm);
        this.mapApi?.removeLayer(this.newLocationLayer);
        this.activeMarker.dragging?.disable();
      });

    this.mapApi.layerEvent$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((event) => {
        this.handleLayerEvent(event as LayerGisEvent);
      });
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

  public onSetEditableLocation(): void {
    this.mapApi?.setEventListener(
      'dragend',
      this.locationsLayer,
      this.activeMarker
    );
  }

  public onSetCurrentStep(step: LocationWizardStepEnum): void {
    this.currentWizardStep = step;

    step === LocationWizardStepEnum.DataForm
      ? this.activeMarker.dragging?.enable()
      : this.activeMarker.dragging?.disable();

    switch (this.currentWizardStep) {
      case LocationWizardStepEnum.SetCoordinates:
      case LocationWizardStepEnum.DataForm:
        const icon = this.locationData?.station
          ? Markers.marker2AltIcon
          : Markers.marker1AltIcon;
        this.activeMarker.setIcon(icon);
        break;
      case LocationWizardStepEnum.Confirmation:
        const iconType = this.locationData?.station
          ? 'marker-2-alt'
          : 'marker-1-alt';
        const labeledIcon = Markers.customMarkerWithText(
          iconType,
          this.locationData?.name ?? ''
        );
        this.activeMarker.setIcon(labeledIcon);
        break;
    }
  }

  public setCoordinatesToInitial(coordinates: Partial<Location>): void {
    const { latitude, longitude } = coordinates;

    if (!latitude || !longitude) return;

    this.activeMarker.setLatLng([+latitude, +longitude]);
    this.onStoreLocationData(coordinates);
  }

  public onEditLocation(): void {
    this.locationsDataService.editLocation(this.locationData as Location);
  }

  public onNavigateBack(coordinates: Partial<Location>): void {
    this.setCoordinatesToInitial(coordinates);
    this.resetState();
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

  private resetState(): void {
    this.mapApi?.removeLayer(this.newLocationLayer);
    this.locationsDataService.setNewLocationData({});
    this.locationsDataService.setCurrentViewType('list');
    this.router.navigate(['/locations']);
  }
}
