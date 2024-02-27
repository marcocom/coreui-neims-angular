import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import * as L from 'leaflet';

import { defaultMarkerIcon } from '@shared/modules/leaflet/extensions';
import { MapComponent } from '@shared/modules/leaflet/components';

const components = [MapComponent];

L.Marker.prototype.options.icon = defaultMarkerIcon;

@NgModule({
  declarations: [...components],
  imports: [CommonModule],
  exports: [...components],
})
export class LeafletModule {}
