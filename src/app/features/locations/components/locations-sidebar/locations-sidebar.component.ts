import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { Location } from '@api/types';
import { snapshot } from '@app/utils';
import { LocationsDataService } from '@data/locations-data.service';
import { LocationsFilters } from '@locations/types';
import { LocationMarkerEventTypeEnum } from '@locations/enums';

@Component({
  selector: 'aqm-locations-sidebar',
  templateUrl: './locations-sidebar.component.html',
  styleUrls: ['./locations-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationsSidebarComponent {
  public viewType$ = this.locationsDataService.viewType$;
  public locations$ = this.locationsDataService.locations$;
  public selectedLocation$ = this.locationsDataService.selectedLocation$;
  public selectedFilters$ = this.locationsDataService.locationsFilters$.pipe(
    take(1)
  );
  public loading$ = this.locationsDataService.loading$;

  constructor(
    private locationsDataService: LocationsDataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  public onLocationClick(pid: string): void {
    this.locationsDataService.emitLocationMarkerEvent(
      LocationMarkerEventTypeEnum.Select,
      pid
    );
  }

  public onLocationMouseEnter(pid: string): void {
    this.locationsDataService.emitLocationMarkerEvent(
      LocationMarkerEventTypeEnum.HighlightOn,
      pid
    );
  }

  public onLocationMouseLeave(pid: string): void {
    this.locationsDataService.emitLocationMarkerEvent(
      LocationMarkerEventTypeEnum.HighlightOff,
      pid
    );
  }

  public closeLocationDetails(): void {
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

    this.locationsDataService.setCurrentViewType('list');
  }

  public onAddLocationNavigate(): void {
    this.locationsDataService.setCurrentViewType('add');
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  public onLocationsFiltersChange(filters: LocationsFilters): void {
    this.locationsDataService.loadLocationsData(filters);
  }

  public onEditLocation(location: Location): void {
    this.locationsDataService.setNewLocationData(location as Partial<Location>);
    this.locationsDataService.setCurrentViewType('edit');
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  public onDeleteLocation(locationId: UUIDv4): void {
    this.locationsDataService.emitLocationDeleteEvent(locationId);
  }
}
