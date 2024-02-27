import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

import { PrimeNgModule } from '@shared/modules/prime-ng.module';

import {
  ContainerComponent,
  DialogComponent,
  HeaderComponent,
  SidebarComponent,
} from '@layout/components';
import { NotFoundPage } from '@layout/pages';

const components = [
  ContainerComponent,
  DialogComponent,
  HeaderComponent,
  SidebarComponent,
  NotFoundPage,
];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, PrimeNgModule, FormsModule],
  exports: [...components],
  providers: [ConfirmationService, DialogService, MessageService],
})
export class LayoutModule {}
