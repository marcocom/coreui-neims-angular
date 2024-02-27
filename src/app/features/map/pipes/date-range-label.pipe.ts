import { Pipe, PipeTransform, Inject, LOCALE_ID } from '@angular/core';
import { formatDate } from '@angular/common';

import { NG_DATE_FORMAT } from '@app/constants';
import { MapFilters } from '@map/types';

/**
 * Generates presentation string of the selected date range
 */
@Pipe({ name: 'dateRangeLabel' })
export class DateRangeLabelPipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private locale: string) {}

  transform(filters: MapFilters): string {
    if (filters.defaultDateRange) {
      return 'Last 30 days';
    }

    const fromDate = formatDate(filters.dateFrom, NG_DATE_FORMAT, this.locale);
    const toDate = formatDate(filters.dateTo, NG_DATE_FORMAT, this.locale);

    return `${fromDate} - ${toDate}`;
  }
}
