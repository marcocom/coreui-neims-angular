import {
  Story,
  Meta,
  moduleMetadata,
  componentWrapperDecorator,
} from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { TabMenuModule } from 'primeng/tabmenu';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

import { PrimeNgContainerComponent, backgrounds } from './helpers';

export default {
  title: 'Components/Header',
  decorators: [
    moduleMetadata({
      declarations: [PrimeNgContainerComponent],
      imports: [
        BrowserAnimationsModule,
        TabMenuModule,
        DropdownModule,
        MenuModule,
        ButtonModule,
        RippleModule,
      ],
    }),
    componentWrapperDecorator(PrimeNgContainerComponent),
  ],
  parameters: {
    backgrounds,
  },
  args: {
    tabItems: [{ label: 'Home' }, { label: 'Map' }, { label: 'About' }],
    languages: [
      { name: 'English', value: 'EN' },
      { name: 'Arabic', value: 'ARB' },
    ],
    menuItems: [{ label: 'New' }, { label: 'Open' }, { label: 'Close' }],
  },
} as Meta;

export const TabMenu: Story = (props) => ({
  props,
  template: `
    <style>
      .wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0 24px;
        height: 80px;
        background: #13100d;
      }
    </style>

    <div class="wrapper">
      <p-tabMenu [model]="tabItems"></p-tabMenu>
    </div>
  `,
});

export const Dropdown: Story = (props) => ({
  props,
  template: `
    <style>
      .wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0 24px;
        height: 80px;
        background: #13100d;
      }
    </style>

    <div class="wrapper">
      <p-dropdown
        #langMenu
        [appendTo]="langMenu"
        [options]="languages"
        optionLabel="name"
        panelStyleClass="header-dropdown-panel"
      ></p-dropdown>
    </div>
  `,
});

export const Menu: Story = (props) => ({
  props,
  template: `
    <style>
      .wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0 24px;
        height: 80px;
        background: #13100d;
      }
    </style>

    <p-menu
      #menu
      [popup]="true"
      [model]="menuItems"
    ></p-menu>

    <div class="wrapper">
      <button
        pButton
        type="button"
        label="Profile"
        class="p-button-lg"
        icon="pi pi-chevron-down"
        iconPos="right"
        (click)="menu.toggle($event)"
      ></button>
    </div>
  `,
});
