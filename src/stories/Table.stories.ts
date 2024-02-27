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
  title: 'Components/Table',
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
    locations: [
      {
        altitude: 538,
        description:
          'The Qassim Province (Arabic: منطقة القصيم Minṭaqat al-Qaṣīm [alqɑˈsˤiːm], Najdi Arabic: [elgəˈsˤiːm])',
        latitude: 34.6374727,
        longitude: 28.1082056,
        name: 'GASSIM',
      },
      {
        altitude: 538,
        description:
          'Arar (Arabic: عرعر ʿArʿar  [ˈʕarʕar]) is the capital of Northern Borders Province in Saudi Arabia.',
        latitude: 35.0694259,
        longitude: 28.1318742,
        name: 'ARAR',
      },
      {
        altitude: 104,
        description:
          'Dammam (Arabic: الدمّام ad-Dammām) is the sixth-most populous city in Saudi Arabia after Riyadh, Jeddah, Mecca, Medina and Khamis Mushait.',
        latitude: 35.2553667,
        longitude: 28.1863741,
        name: 'DAMMAM (KING FAHD INT. AIRPORT)',
      },
      {
        altitude: 454,
        description:
          'Mount Arafat (Arabic: جَبَل عَرَفَات, romanized: Jabal ʿArafāt), also known by its Arabic name Jabal Arafat, and by its other Arabic name, Jabal ar-Rahmah.',
        latitude: 35.2553667,
        longitude: 28.1863741,
        name: 'ARAFAT',
      },
      {
        altitude: 331,
        description:
          'Dawadmi or Ad Dawadimi (Arabic: الدوادمي) is a town in Riyadh Province, Saudi Arabia. As of the 2004 census it had a population of 53,071 people.',
        latitude: 35.6785421,
        longitude: 28.0934037,
        name: 'AL-DAWADAMI',
      },
      {
        altitude: 221,
        description:
          'Al-Jawf Province (Arabic: منطقة الجوف Minṭaqah al-Jawf pronounced [alˈdʒoːf]), also spelled Al-Jouf, is one of the provinces of Saudi Arabia.',
        latitude: 35.9061592,
        longitude: 28.1222566,
        name: 'AL JOUF',
      },
    ],
    cities: [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' },
    ],
    cols: [
      { field: 'name', header: 'Name' },
      { field: 'latitude', header: 'Latitude' },
      { field: 'longitude', header: 'Longitude' },
      { field: 'altitude', header: 'Altitude' },
      { field: 'description', header: 'Description' },
    ],
    selectedLocations: [],
    selectedCity: null,
  },
} as Meta;

export const MultiSelect: Story = (props) => ({
  props,
  template: `
    <div class="container">
      <p-table #dt
        [columns]="cols"
        [value]="locations"
        selectionMode="multiple"
        [(selection)]="selectedLocations"
        [paginator]="true"
        [rows]="2"
        (sortFunction)="onSort($event)"
        [customSort]="true">
        <ng-template pTemplate="caption">
          <div class="d-flex justify-content-between">
            <div class="filters">
              <p-dropdown [options]="cities"
                [(ngModel)]="selectedCity"
                placeholder="Select a City"
                optionLabel="name">
              </p-dropdown>
            </div>

            <aqm-table-search placeholder="Search keyword"></aqm-table-search>
          </div>
        </ng-template>

        <ng-template pTemplate="header" let-columns>
          <tr>
            <th>
              <p-tableHeaderCheckbox></p-tableHeaderCheckbox>
            </th>

            <th *ngFor="let col of columns"
              [pSortableColumn]="col.field">
              <div class="d-flex align-items-center">
                {{col.header}}

                <div class="sort">
                  <i class="ne ne-arrow-bullet"
                    [class.active]="false"></i>
                  <i class="ne ne-arrow-bullet marker-down"
                    [class.active]="true"></i>
                </div>
              </div>
            </th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body"
          let-location
          let-rowData
          let-columns="columns">
          <tr [pSelectableRow]="rowData">
            <td>
              <p-tableCheckbox [value]="rowData"></p-tableCheckbox>
            </td>
            <td *ngFor="let col of columns">
              <ng-container *ngIf="col.field !== 'description'; else desc">
                {{rowData[col.field]}}
              </ng-container>
              <ng-template #desc>
                {{ rowData[col.field] | slice:0:170}}
              </ng-template>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
});
