import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  Chart,
  LinearScale,
  TimeSeriesScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

import { TimeSeriesChartComponent } from '@shared/modules/chart/components';
import { CrosshairPlugin } from '@shared/modules/chart/plugins';

Chart.register(
  LinearScale,
  TimeSeriesScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  CrosshairPlugin
);

Chart.defaults.color = '#737373';
Chart.defaults.plugins.title.font.size = 18;
Chart.defaults.plugins.title.color = '#000000';
Chart.defaults.plugins.title.position = 'top';
Chart.defaults.plugins.title.align = 'start';
Chart.defaults.datasets.line.borderColor = '#ebc03f';
Chart.defaults.scale.grid.color = '#e5e5e5';
Chart.defaults.scale.grid.borderColor = '#e5e5e5';

const components = [TimeSeriesChartComponent];

@NgModule({
  declarations: [...components],
  imports: [CommonModule],
  exports: [...components],
})
export class ChartModule {}
