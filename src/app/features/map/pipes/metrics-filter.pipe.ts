import { Pipe, PipeTransform } from '@angular/core';

import { Metrics } from '@api/types';

/**
 * Filter metrics by metric key
 */
@Pipe({ name: 'metricsFilter' })
export class MetricsFilterPipe implements PipeTransform {
  transform(metrics: Metrics[], metricKey: string): Metrics[] {
    return metrics.filter((item) => metricKey in item.metrics);
  }
}
