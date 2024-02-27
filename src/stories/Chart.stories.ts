import { Story, Meta, moduleMetadata } from '@storybook/angular';

import { backgrounds } from './helpers';

import { dayjs } from '@app/utils';
import { ChartModule } from '@shared/modules/chart/chart.module';

function mockData(count: number, startDate: string) {
  return Array.from({ length: count }).map((_, index) => ({
    value: +(Math.random() * 100).toFixed(2),
    timestamp: dayjs(startDate)
      .add(index * 4, 'hour')
      .toISOString(),
  }));
}

const now = dayjs();
const min = dayjs().subtract(8, 'day');
const max = now;

export default {
  title: 'Components/Chart',
  decorators: [
    moduleMetadata({
      imports: [ChartModule],
    }),
  ],
  parameters: {
    backgrounds,
  },
  args: {
    data: mockData(30, min.toISOString()),
  },
} as Meta;

export const Basic: Story = (args) => ({
  props: {
    ...args,
    label: 'Carbon monoxide',
    xAxisKey: 'timestamp',
    yAxisKey: 'value',
    yLabel: 'µg/m³',
  },
  template: `
    <aqm-time-series-chart
      style="width: 560px; height: 300px;"
      [label]="label"
      [data]="data"
      [xAxisKey]="xAxisKey"
      [yAxisKey]="yAxisKey"
      [yLabel]="yLabel"
    ></aqm-time-series-chart>
  `,
});

export const MinMax: Story = (args) => ({
  props: {
    ...args,
    label: 'Carbon monoxide',
    xAxisKey: 'timestamp',
    yAxisKey: 'value',
    yLabel: 'µg/m³',
    min: min.toDate(),
    max: max.toDate(),
  },
  template: `
    <aqm-time-series-chart
      style="width: 560px; height: 300px;"
      [label]="label"
      [data]="data"
      [xAxisKey]="xAxisKey"
      [yAxisKey]="yAxisKey"
      [yLabel]="yLabel"
      [xMin]="min"
      [xMax]="max"
    ></aqm-time-series-chart>
  `,
});

export const CustomTooltip: Story = (args) => ({
  props: {
    ...args,
    label: 'Carbon monoxide',
    xAxisKey: 'timestamp',
    yAxisKey: 'value',
    yLabel: 'µg/m³',
  },
  template: `
    <style>
      .tooltip {
        background: black;
        color: white;
        font-size: 14px;
        padding: 6px 12px;
        border-radius: 8px;
      }
    </style>

    <aqm-time-series-chart
      style="width: 560px; height: 300px;"
      [label]="label"
      [data]="data"
      [xAxisKey]="xAxisKey"
      [yAxisKey]="yAxisKey"
      [yLabel]="yLabel"
    >
      <ng-template #tooltip let-data>
        <div class="tooltip">
          {{ data?.value }}
        </div>
      </ng-template>
    </aqm-time-series-chart>
  `,
});
