import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutModule } from '@layout/layout.module';
import { SharedModule } from '@shared/shared.module';
import { LeafletModule } from '@shared/modules/leaflet';
import { ChartModule } from '@shared/modules/chart';
import { MapFiltersComponent, MapTooltipComponent } from '@map/components';
import { DateRangeLabelPipe, MetricsFilterPipe } from '@map/pipes';
import { MapViewPage, LocationDetailsPage } from '@map/pages';
import { MapRoutingModule } from '@map/map-routing.module';

const components = [
  MapViewPage,
  MapFiltersComponent,
  MapTooltipComponent,
  LocationDetailsPage,
];

const pipes = [DateRangeLabelPipe, MetricsFilterPipe];

const modules = [
  CommonModule,
  SharedModule,
  LayoutModule,
  MapRoutingModule,
  LeafletModule,
  ChartModule,
];

@NgModule({
  declarations: [...components, ...pipes],
  imports: [...modules],
})
export class MapModule {}
