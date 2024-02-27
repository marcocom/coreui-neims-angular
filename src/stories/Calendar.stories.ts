import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  Story,
  Meta,
  moduleMetadata,
  componentWrapperDecorator,
} from '@storybook/angular';

import { PrimeNgContainerComponent, backgrounds } from './helpers';

import { CalendarModule } from 'primeng/calendar';
import { RippleModule } from 'primeng/ripple';

export default {
  title: 'Components/Calendar',
  decorators: [
    moduleMetadata({
      declarations: [PrimeNgContainerComponent],
      imports: [BrowserAnimationsModule, CalendarModule, RippleModule],
    }),
    componentWrapperDecorator(PrimeNgContainerComponent),
  ],
  parameters: {
    backgrounds,
  },
  args: {
    selectionMode: 'single',
    placeholder: 'mm/dd/yyyy',
    firstDayOfWeek: 1,
    dateFormat: 'd M yy',
    readonlyInput: true,
    minDate: new Date(2021, 7, 1),
    maxDate: null,
  },
  argTypes: {
    selectionMode: {
      control: { type: 'select' },
      options: ['single', 'range'],
    },
    minDate: { control: 'date' },
    maxDate: { control: 'date' },
  },
} as Meta;

const Template: Story = (args) => ({
  props: {
    ...args,
    minDate: args.minDate ? new Date(args.minDate) : null,
    maxDate: args.maxDate ? new Date(args.maxDate) : null,
    icon: 'ne ne-calendar',
  },
  template: `
  <style>
    ::ng-deep .p-calendar {
      width: 360px !important;
    }
  </style>

  <p-calendar
    [selectionMode]="selectionMode"
    [placeholder]="placeholder"
    [firstDayOfWeek]="firstDayOfWeek"
    [dateFormat]="dateFormat"
    [showIcon]="showIcon"
    [icon]="icon"
    [minDate]="minDate"
    [maxDate]="maxDate"
    [readonlyInput]="readonlyInput"
  ></p-calendar>
  `,
});

export const Basic: Story = Template.bind({});
Basic.args = {
  showIcon: false,
};

export const Icon: Story = Template.bind({});
Icon.args = {
  showIcon: true,
};

export const Range: Story = Template.bind({});
Range.args = {
  selectionMode: 'range',
};
