import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MapViewPage, LocationDetailsPage } from '@map/pages';

const routes: Routes = [
  {
    path: '',
    component: MapViewPage,
  },
  {
    path: 'location/:id',
    component: LocationDetailsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapRoutingModule {}
