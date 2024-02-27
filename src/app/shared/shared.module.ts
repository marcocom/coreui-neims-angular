import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkStepperModule } from '@angular/cdk/stepper';

import {
  TabViewScrollerComponent,
  TableSearchComponent,
  StepperComponent,
  FileUploaderComponent,
} from '@shared/components';
import { MultiselectDirective } from '@shared/directives';
import { TranslatePipe } from '@shared/pipes';
import { PrimeNgModule } from '@shared/modules/prime-ng.module';

const components = [
  TabViewScrollerComponent,
  TableSearchComponent,
  StepperComponent,
  FileUploaderComponent,
];

const directives = [MultiselectDirective];

const pipes = [TranslatePipe];

const modules = [
  CdkStepperModule,
  FormsModule,
  ReactiveFormsModule,
  PrimeNgModule,
];

@NgModule({
  declarations: [...components, ...directives, ...pipes],
  imports: [CommonModule, ...modules],
  exports: [...modules, ...components, ...directives, ...pipes],
})
export class SharedModule {}
