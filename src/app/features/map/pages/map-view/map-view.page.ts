import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, take, takeUntil, withLatestFrom } from 'rxjs/operators';

import { dayjs, snapshot } from '@app/utils';
import {
  MEASUREMENT_SCORE_COLOR,
  MEASUREMENT_SCORE_LABEL,
  MEASUREMENT_SCORE_INDEX,
  NO_DATA_COLOR,
} from '@app/constants';
import { LocationVisibilityEnum } from '@api/enums';
import { Environment } from '@core/types';
import { ENVIRONMENT } from '@core/providers';
import { LocationsFilters, MetricsFilters } from '@api/types';
import { MapDataService } from '@data/map-data.service';
import { MapFiltersFormValue } from '@map/types';
import { MapTooltipComponent } from '@map/components';
import {
  MapOptions,
  MapRegistryService,
  Markers,
} from '@shared/modules/leaflet';

@Component({
  selector: 'aqm-map-view',
  templateUrl: './map-view.page.html',
  styleUrls: ['./map-view.page.scss'],
})
export class MapViewPage implements OnInit, AfterViewInit, OnDestroy {
  public locations$ = this.mapDataService.locations$;
  public capabilities$ = this.mapDataService.capabilities$;
  public loading$ = this.mapDataService.loading$;
  public lastUpdate$ = this.mapDataService.lastUpdate$;
  public defaultDateRange$ = this.mapDataService.defaultDateRange$;

  public defaultFilters$: Observable<MapFiltersFormValue> =
    this.mapDataService.mapFilters$.pipe(
      withLatestFrom(
        this.mapDataService.locationIdMap$,
        this.mapDataService.capabilityNameMap$
      ),
      map(([mapFilters, locationIdMap, capabilityNameMap]) => ({
        locations: mapFilters.locations.map((id) => locationIdMap[id]),
        capabilities: mapFilters.capabilities.map(
          (name) => capabilityNameMap[name]
        ),
        dateRange: !mapFilters.defaultDateRange
          ? [
              dayjs(mapFilters.dateFrom).toDate(),
              dayjs(mapFilters.dateTo).toDate(),
            ]
          : null,
      })),
      take(1)
    );

  private readonly mapKey = 'map-dashboard';
  private readonly aqmLayer = 'aqm';
  private readonly unsubscribe$ = new Subject<void>();

  public readonly options: MapOptions = {
    mapKey: this.mapKey,
    tileServerUrl: this.env.mapConfig.tileServerUrl,
    attribution: this.env.mapConfig.attribution,
    center: [28.5, 35],
    zoom: 10,
  };

  public readonly scores = MEASUREMENT_SCORE_INDEX.map((key) => ({
    label: MEASUREMENT_SCORE_LABEL[key],
    color: MEASUREMENT_SCORE_COLOR[key],
  }));
  public readonly NO_DATA_COLOR = NO_DATA_COLOR;

  constructor(
    @Inject(ENVIRONMENT) private env: Environment,
    private mapRegistry: MapRegistryService,
    private mapDataService: MapDataService
  ) {}

  public ngOnInit(): void {
    this.mapDataService.fetchLocations();
    this.mapDataService.loadMapData(this.getAppliedFilters());
    this.mapDataService.fetchCapabilities();
  }

  public ngAfterViewInit(): void {
    const mapApi = this.mapRegistry.getApi(this.mapKey);

    if (!mapApi) return;

    this.mapDataService.mapDataLoaded$
      .pipe(
        withLatestFrom(this.mapDataService.mapFilters$),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(([mapData, mapFilters]) => {
        const { geo, gisLocations, metricsPerLocation } = mapData;

        mapApi.removeLayer(this.aqmLayer);

        mapApi.createLayer(
          this.aqmLayer,
          geo,
          {
            pointToLayer: (feature, { lat, lng }) => {
              return Markers.createCircleMarker(lat, lng);
            },
            filter: (feature) => {
              const pid = String(feature.properties.pid);
              const location = gisLocations[pid];

              if (location?.visibility !== LocationVisibilityEnum.Published) {
                return false;
              }

              const hasData = !!(
                location.station &&
                metricsPerLocation[location.station.serialNumber]
              );

              return (
                hasData ||
                (!mapFilters.capabilities.length && mapFilters.defaultDateRange)
              );
            },
            style: (feature) => {
              const pid = String(feature?.properties.pid);
              const location = gisLocations[pid];
              const metrics = location.station
                ? metricsPerLocation[location.station.serialNumber]
                : null;

              return {
                color: metrics
                  ? this.scores[metrics.score].color
                  : this.NO_DATA_COLOR,
                fillOpacity: 1,
              };
            },
          },
          MapTooltipComponent
        );
      });
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public onApplyFilters(mapFilters: MapFiltersFormValue): void {
    const filters: Partial<LocationsFilters & MetricsFilters> = {};

    const { locations, capabilities, dateRange } = mapFilters;

    if (locations.length) {
      filters.locationIds = locations.map((location) => location?.uuid || '');
    }

    if (capabilities.length) {
      filters.capabilities = capabilities.map((capability) => capability.name);
    }

    if (dateRange) {
      const [from, to] = dateRange;
      filters.fromDate = dayjs(from).startOf('day').toISOString();
      filters.toDate = dayjs(to).endOf('day').toISOString();
    }

    this.mapDataService.loadMapData(filters);
  }

  public onResetFilters(): void {
    this.mapDataService.loadMapData();
  }

  private getAppliedFilters(): Partial<LocationsFilters & MetricsFilters> {
    const result: Partial<LocationsFilters & MetricsFilters> = {};
    const filters = snapshot(this.mapDataService.mapFilters$);

    if (!filters) return result;

    if (!filters.defaultDateRange) {
      result.fromDate = filters.dateFrom;
      result.toDate = filters.dateTo;
    }

    if (filters.locations.length) {
      result.locationIds = filters.locations;
    }

    if (filters.capabilities.length) {
      result.capabilities = filters.capabilities;
    }

    return result;
  }
}
