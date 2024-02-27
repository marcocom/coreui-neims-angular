import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';
import { AuthRoutingModule } from '@auth/auth-routing.module';
import { LoginPage } from '@auth/pages';

const pages = [LoginPage];

@NgModule({
  declarations: [...pages],
  imports: [CommonModule, SharedModule, AuthRoutingModule],
})
export class AuthModule {}
