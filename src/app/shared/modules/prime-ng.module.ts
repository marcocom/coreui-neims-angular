import { NgModule } from '@angular/core';

import { AvatarModule } from 'primeng/avatar';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { MenuModule } from 'primeng/menu';
import { TabMenuModule } from 'primeng/tabmenu';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { TabViewModule } from 'primeng/tabview';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { RippleModule } from 'primeng/ripple';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CarouselModule } from 'primeng/carousel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';

const modules = [
  AvatarModule,
  CalendarModule,
  CarouselModule,
  CheckboxModule,
  ConfirmDialogModule,
  DropdownModule,
  DynamicDialogModule,
  MenuModule,
  MultiSelectModule,
  RadioButtonModule,
  RippleModule,
  ScrollPanelModule,
  SelectButtonModule,
  TableModule,
  TabMenuModule,
  TabViewModule,
  ToastModule,
];

@NgModule({
  imports: [...modules],
  exports: [...modules],
})
export class PrimeNgModule {}
