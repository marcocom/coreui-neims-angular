import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@auth/guards';
import { NotFoundPage } from '@layout/pages';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'map',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    data: {
      displayHeader: false,
    },
    loadChildren: () => import('@auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'map',
    loadChildren: () => import('@map/map.module').then((m) => m.MapModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'locations',
    loadChildren: () =>
      import('@locations/locations.module').then((m) => m.LocationsModule),
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    component: NotFoundPage,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
