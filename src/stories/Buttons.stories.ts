import {
  Story,
  Meta,
  moduleMetadata,
  componentWrapperDecorator,
} from '@storybook/angular';

import { PrimeNgContainerComponent, backgrounds } from './helpers';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

export default {
  title: 'Components/Button',
  decorators: [
    moduleMetadata({
      declarations: [PrimeNgContainerComponent],
      imports: [ButtonModule, RippleModule],
    }),
    componentWrapperDecorator(PrimeNgContainerComponent),
  ],
  parameters: {
    backgrounds,
  },
} as Meta;

export const All: Story = () => ({
  template: `
  <style>
    .button-group {
      margin-bottom: 0.5rem;
    }

    .button-group > button {
      margin-right: 0.5rem;
    }
  </style>

  <div class="button-group">
    <button pButton pRipple type="button" label="Action" class="p-button-lg"></button>
    <button pButton pRipple type="button" label="Action" icon="pi pi-arrow-left" iconPos="left" class="p-button-lg"></button>
    <button pButton pRipple type="button" label="Action" icon="pi pi-arrow-right" iconPos="right" class="p-button-lg"></button>
    <button pButton pRipple type="button" icon="pi pi-check" class="p-button-lg"></button>
    <button pButton pRipple type="button" icon="pi pi-check" class="p-button-rounded p-button-lg"></button>
  </div>

  <div class="button-group">
    <button pButton pRipple type="button" label="Action" class="p-button-secondary p-button-lg"></button>
    <button pButton pRipple type="button" label="Action" icon="pi pi-arrow-left" iconPos="left" class="p-button-secondary p-button-lg"></button>
    <button pButton pRipple type="button" label="Action" icon="pi pi-arrow-right" iconPos="right" class="p-button-secondary p-button-lg"></button>
    <button pButton pRipple type="button" icon="pi pi-check" class="p-button-secondary p-button-lg"></button>
    <button pButton pRipple type="button" icon="pi pi-check" class="p-button-secondary p-button-rounded p-button-lg"></button>
  </div>

  <div class="button-group">
    <button pButton pRipple type="button" label="Action" class="p-button-text p-button-lg"></button>
    <button pButton pRipple type="button" label="Action" icon="pi pi-arrow-left" iconPos="left" class="p-button-text p-button-lg"></button>
    <button pButton pRipple type="button" label="Action" icon="pi pi-arrow-right" iconPos="right" class="p-button-text p-button-lg"></button>
    <button pButton pRipple type="button" icon="pi pi-check" class="p-button-text p-button-lg"></button>
  </div>

  <div class="button-group">
    <button pButton pRipple type="button" label="Action"></button>
    <button pButton pRipple type="button" label="Action" icon="pi pi-arrow-left" iconPos="left"></button>
    <button pButton pRipple type="button" label="Action" icon="pi pi-arrow-right" iconPos="right"></button>
    <button pButton pRipple type="button" icon="pi pi-check"></button>
    <button pButton pRipple type="button" icon="pi pi-check" class="p-button-rounded"></button>
  </div>

  <div class="button-group">
    <button pButton pRipple type="button" label="Action" class="p-button-secondary"></button>
    <button pButton pRipple type="button" label="Action" icon="pi pi-arrow-left" iconPos="left" class="p-button-secondary"></button>
    <button pButton pRipple type="button" label="Action" icon="pi pi-arrow-right" iconPos="right" class="p-button-secondary"></button>
    <button pButton pRipple type="button" icon="pi pi-check" class="p-button-secondary"></button>
    <button pButton pRipple type="button" icon="pi pi-check" class="p-button-secondary p-button-rounded"></button>
  </div>

  <div class="button-group">
    <button pButton pRipple type="button" label="Action" class="p-button-text"></button>
    <button pButton pRipple type="button" label="Action" icon="pi pi-arrow-left" iconPos="left" class="p-button-text"></button>
    <button pButton pRipple type="button" label="Action" icon="pi pi-arrow-right" iconPos="right" class="p-button-text"></button>
    <button pButton pRipple type="button" icon="pi pi-check" class="p-button-text"></button>
  </div>

  <div class="button-group">
    <button pButton pRipple type="button" label="Action" class="p-button-sm"></button>
    <button pButton pRipple type="button" label="Action" icon="pi pi-arrow-left" iconPos="left" class="p-button-sm"></button>
    <button pButton pRipple type="button" label="Action" icon="pi pi-arrow-right" iconPos="right" class="p-button-sm"></button>
    <button pButton pRipple type="button" icon="pi pi-check" class="p-button-sm"></button>
    <button pButton pRipple type="button" icon="pi pi-check" class="p-button-rounded p-button-sm"></button>
  </div>

  <div class="button-group">
    <button pButton pRipple type="button" label="Action" class="p-button-secondary p-button-sm"></button>
    <button pButton pRipple type="button" label="Action" icon="pi pi-arrow-left" iconPos="left" class="p-button-secondary p-button-sm"></button>
    <button pButton pRipple type="button" label="Action" icon="pi pi-arrow-right" iconPos="right" class="p-button-secondary p-button-sm"></button>
    <button pButton pRipple type="button" icon="pi pi-check" class="p-button-secondary p-button-sm"></button>
    <button pButton pRipple type="button" icon="pi pi-check" class="p-button-secondary p-button-rounded p-button-sm"></button>
  </div>

  <div class="button-group">
    <button pButton pRipple type="button" label="Action" class="p-button-text p-button-sm"></button>
    <button pButton pRipple type="button" label="Action" icon="pi pi-arrow-left" iconPos="left" class="p-button-text p-button-sm"></button>
    <button pButton pRipple type="button" label="Action" icon="pi pi-arrow-right" iconPos="right" class="p-button-text p-button-sm"></button>
    <button pButton pRipple type="button" icon="pi pi-check" class="p-button-text p-button-sm"></button>
  </div>
  `,
});
