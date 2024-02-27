import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  LocationAddPage,
  LocationEditPage,
  LocationsPage,
} from '@locations/pages';

const routes: Routes = [
  {
    path: '',
    component: LocationsPage,
  },
  {
    path: 'add',
    component: LocationAddPage,
  },
  {
    path: 'edit',
    component: LocationEditPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationsRoutingModule {}
