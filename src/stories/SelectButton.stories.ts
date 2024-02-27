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
  title: 'Components/SelectButton',
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
    cities: [
      { name: 'New York', value: 'NY' },
      { name: 'Rome', value: 'RM' },
    ],
    selectedOptionSingle: 'NY',
    selectedOptionMultiple: null,
  },
} as Meta;

export const SingleSelection: Story = (props) => ({
  props,
  template: `
    <p-selectButton [options]="cities"
      [(ngModel)]="selectedOptionSingle"
      optionLabel="name"
      optionValue="value"></p-selectButton>
  `,
});
