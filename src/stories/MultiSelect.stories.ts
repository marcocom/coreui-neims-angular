import {
  Story,
  Meta,
  moduleMetadata,
  componentWrapperDecorator,
} from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PrimeNgContainerComponent, backgrounds } from './helpers';

import { MultiSelectModule } from 'primeng/multiselect';

import { MultiselectDirective } from '@shared/directives';

export default {
  title: 'Components/MultiSelect',
  decorators: [
    moduleMetadata({
      declarations: [PrimeNgContainerComponent, MultiselectDirective],
      imports: [MultiSelectModule, BrowserAnimationsModule, FormsModule],
    }),
    componentWrapperDecorator(PrimeNgContainerComponent),
  ],
  parameters: {
    backgrounds,
  },
  args: {
    inputPlaceholder: 'Select items',
    searchPlaceholder: 'Search',
    cities: [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' },
    ],
    selectedCities: [],
  },
} as Meta;

export const Basic: Story = (props) => ({
  props,
  template: `
    <style>
      .wrapper {
        width: 400px;
      }
    </style>

    <div class="wrapper">
      <p-multiSelect
        aqmMultiselect
        [options]="cities"
        [(ngModel)]="selectedCities"
        [placeholder]="inputPlaceholder"
        [showHeader]="false"
        optionLabel="name"
      ></p-multiSelect>
    </div>
  `,
});

export const Chip: Story = (props) => ({
  props,
  template: `
    <style>
      .wrapper {
        width: 400px;
      }
    </style>

    <div class="wrapper">
      <p-multiSelect
        aqmMultiselect
        [options]="cities"
        [(ngModel)]="selectedCities"
        [placeholder]="inputPlaceholder"
        [showHeader]="false"
        optionLabel="name"
        display="chip"
      ></p-multiSelect>
    </div>
  `,
});

export const Header: Story = (props) => ({
  props,
  template: `
    <style>
      .wrapper {
        width: 400px;
      }
    </style>

    <div class="wrapper">
      <p-multiSelect
        aqmMultiselect
        [options]="cities"
        [(ngModel)]="selectedCities"
        [placeholder]="inputPlaceholder"
        [filterPlaceHolder]="searchPlaceholder"
        optionLabel="name"
        display="chip"
      ></p-multiSelect>
    </div>
  `,
});
