import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import {
  MEASUREMENT_SCORE_COLOR,
  MEASUREMENT_SCORE_LABEL,
  MEASUREMENT_SCORE_INDEX,
  NG_DATE_TIME_FORMAT,
} from '@app/constants';
import { Location } from '@api/types';
import { MapDataService } from '@data/map-data.service';

@Component({
  selector: 'aqm-location-details',
  templateUrl: './location-details.page.html',
  styleUrls: ['./location-details.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationDetailsPage implements OnInit {
  public location$!: Observable<Nullable<Location>>;

  public templateData$ = combineLatest([
    this.mapDataService.mapFilters$,
    this.mapDataService.capabilities$,
    this.mapDataService.metrics$,
    this.mapDataService.loading$,
  ]).pipe(
    map(([mapFilters, capabilities, metrics, loading]) => ({
      mapFilters,
      capabilities,
      metrics,
      loading,
    }))
  );

  public readonly dateTimeFormat: string = NG_DATE_TIME_FORMAT;
  public readonly scores = MEASUREMENT_SCORE_INDEX.map((key) => ({
    label: MEASUREMENT_SCORE_LABEL[key],
    color: MEASUREMENT_SCORE_COLOR[key],
  }));

  constructor(
    private route: ActivatedRoute,
    private mapDataService: MapDataService
  ) {}

  public ngOnInit(): void {
    const locationId: string = this.route.snapshot.params.id;

    this.location$ = this.mapDataService.getLocation(locationId).pipe(
      tap((location) => {
        if (!location?.station) return;

        this.mapDataService.loadMetrics(location.station.serialNumber);
      })
    );
  }
}
