import {
  Story,
  Meta,
  moduleMetadata,
  componentWrapperDecorator,
} from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PrimeNgContainerComponent, backgrounds } from './helpers';

import { SharedModule } from '@shared/shared.module';

export default {
  title: 'Components/Dropdown',
  decorators: [
    moduleMetadata({
      declarations: [PrimeNgContainerComponent],
      imports: [SharedModule, BrowserAnimationsModule, FormsModule],
    }),
    componentWrapperDecorator(PrimeNgContainerComponent),
  ],
  parameters: {
    backgrounds,
  },
  args: {
    placeholder: 'Select a City',
    cities: [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' },
    ],
    selectedCity: null,
  },
} as Meta;

export const Standard: Story = (props) => ({
  props,
  template: `
  <p-dropdown [options]="cities"
    [(ngModel)]="selectedCity"
    [placeholder]="placeholder"
    optionLabel="name"></p-dropdown>
  `,
});
