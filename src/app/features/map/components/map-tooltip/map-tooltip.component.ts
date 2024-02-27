import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { LocationData } from '@map/types';
import { MapTooltip } from '@shared/modules/leaflet';
import { MapDataService } from '@data/map-data.service';

@Component({
  selector: 'aqm-map-tooltip',
  templateUrl: './map-tooltip.component.html',
  styleUrls: ['./map-tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapTooltipComponent implements MapTooltip {
  public locationData$!: Observable<Nullable<LocationData>>;
  public readonly metricKeyMap$ = this.mapDataService.metricKeyMap$;

  constructor(private router: Router, private mapDataService: MapDataService) {}

  public onTooltipInit(data: any): void {
    this.locationData$ = this.mapDataService.getLocationData(data.pid);
  }

  public seeMore(locationId: UUIDv4, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['map/location', locationId]);
  }
}
