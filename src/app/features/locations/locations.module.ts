import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutModule } from '@layout/layout.module';
import { SharedModule } from '@shared/shared.module';
import { LeafletModule } from '@shared/modules/leaflet';
import {
  LocationAddComponent,
  LocationDataComponent,
  LocationDataFormComponent,
  LocationDetailsComponent,
  LocationEditComponent,
  LocationListComponent,
  LocationCoordinatesComponent,
  LocationConfirmComponent,
  LocationsSidebarComponent,
  LocationVisibilityComponent,
} from '@locations/components';
import {
  LocationsPage,
  LocationEditPage,
  LocationAddPage,
} from '@locations/pages';
import { LocationsRoutingModule } from '@locations/locations-routing.module';

const components = [
  LocationAddComponent,
  LocationCoordinatesComponent,
  LocationConfirmComponent,
  LocationDataComponent,
  LocationDataFormComponent,
  LocationDetailsComponent,
  LocationEditComponent,
  LocationListComponent,
  LocationsSidebarComponent,
  LocationsPage,
  LocationEditPage,
  LocationAddPage,
  LocationVisibilityComponent,
];

const modules = [
  CommonModule,
  LayoutModule,
  LocationsRoutingModule,
  SharedModule,
  LeafletModule,
];

@NgModule({
  declarations: [...components],
  imports: [...modules],
})
export class LocationsModule {}
