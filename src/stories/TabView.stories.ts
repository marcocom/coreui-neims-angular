import {
  Story,
  Meta,
  moduleMetadata,
  componentWrapperDecorator,
} from '@storybook/angular';

import { PrimeNgContainerComponent, backgrounds } from './helpers';

import { SharedModule } from '@shared/shared.module';

export default {
  title: 'Components/TabView',
  decorators: [
    moduleMetadata({
      declarations: [PrimeNgContainerComponent],
      imports: [SharedModule],
    }),
    componentWrapperDecorator(PrimeNgContainerComponent),
  ],
  parameters: {
    backgrounds,
  },
} as Meta;

export const Basic: Story = () => ({
  template: `
  <p-tabView>
    <p-tabPanel header="Ozone">
      <span>Ozone</span>
    </p-tabPanel>
    <p-tabPanel header="Nitrous Oxide">
      <span>Nitrous Oxide</span>
    </p-tabPanel>
    <p-tabPanel header="Carbon Monoxide">
      <span>Carbon Monoxide</span>
    </p-tabPanel>
  </p-tabView>
  `,
});

export const Scroller: Story = () => ({
  template: `
  <style>
    aqm-tab-view-scroller {
      display: block;
      width: 425px;
    }
  </style>

  <aqm-tab-view-scroller>
    <p-tabView>
      <p-tabPanel header="Ozone">
        <span>Ozone</span>
      </p-tabPanel>
      <p-tabPanel header="Nitrous Oxide">
        <span>Nitrous Oxide</span>
      </p-tabPanel>
      <p-tabPanel header="Carbon Monoxide">
        <span>Carbon Monoxide</span>
      </p-tabPanel>
      <p-tabPanel header="Sulphur Dioxide">
        <span>Sulphur Dioxide</span>
      </p-tabPanel>
      <p-tabPanel header="Lead">
        <span>Lead</span>
      </p-tabPanel>
      <p-tabPanel header="Particulate Matter 2.5">
        <span>Particulate Matter 2.5</span>
      </p-tabPanel>
      <p-tabPanel header="Particulate Matter 5">
        <span>Particulate Matter 5</span>
      </p-tabPanel>
      <p-tabPanel header="Particulate Matter 10">
        <span>Particulate Matter 10</span>
      </p-tabPanel>
    </p-tabView>
  </aqm-tab-view-scroller>
  `,
});
