import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { Calendar } from 'primeng/calendar';

import {
  DATE_FORMAT,
  PRIME_DATE_FORMAT,
  NG_DATE_TIME_FORMAT,
} from '@app/constants';
import { CustomValidators, dayjs } from '@app/utils';
import { Capability, Location } from '@api/types';
import { MapFiltersFormValue } from '@map/types';

@Component({
  selector: 'aqm-map-filters',
  templateUrl: './map-filters.component.html',
  styleUrls: ['./map-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapFiltersComponent implements OnInit {
  @Input() public locations!: Location[];

  @Input() public capabilities!: Capability[];

  @Input() public lastUpdate: Nullable<string | Date>;

  @Input() public loading: boolean = false;

  @Input() public defaultDateRange: boolean = true;

  @Input() public defaultFilters?: MapFiltersFormValue;

  @Output() public applyFilters: EventEmitter<MapFiltersFormValue> =
    new EventEmitter();

  @Output() public resetFilters: EventEmitter<void> = new EventEmitter();

  public mapFiltersForm!: FormGroup;
  public readonly dateFormat: string = PRIME_DATE_FORMAT;
  public readonly dateTimeFormat: string = NG_DATE_TIME_FORMAT;
  public readonly dateRangePlaceholder: string = `${DATE_FORMAT} - ${DATE_FORMAT}`;
  public maxDate: Date = dayjs().toDate();
  public minDate: Date = dayjs(this.maxDate).subtract(24, 'month').toDate();
  public calendarOpened: boolean = false;

  public get dateRangeControl(): FormControl {
    return this.mapFiltersForm.get('dateRange') as FormControl;
  }

  public get formValue(): MapFiltersFormValue {
    const formValue = this.mapFiltersForm.value as MapFiltersFormValue;
    const { locations, capabilities } = formValue;

    return {
      ...formValue,
      locations: locations ?? [],
      capabilities: capabilities ?? [],
    };
  }

  public get filterSelected(): boolean {
    return Object.values(this.formValue).some((value) =>
      Array.isArray(value) ? value.length : value
    );
  }

  public get canReset(): boolean {
    return this.filterSelected && !this.loading;
  }

  public get canApply(): boolean {
    return (
      this.mapFiltersForm.dirty && this.mapFiltersForm.valid && !this.loading
    );
  }

  constructor(private fb: FormBuilder) {}

  public ngOnInit(): void {
    this.mapFiltersForm = this.fb.group({
      locations: [this.defaultFilters?.locations ?? null],
      capabilities: [this.defaultFilters?.capabilities ?? null],
      dateRange: [
        this.defaultFilters?.dateRange ?? null,
        [CustomValidators.dateRange],
      ],
    });
  }

  public onResetFilters(): void {
    this.mapFiltersForm.reset({
      locations: null,
      capabilities: null,
      dateRange: null,
    });

    this.resetFilters.emit();
  }

  public onApplyFilters(): void {
    this.applyFilters.next(this.formValue);
    this.mapFiltersForm.markAsPristine();
  }

  public onDateRangeSelected(calendar: Calendar): void {
    if (this.dateRangeControl.valid) {
      calendar.hideOverlay();
    }
  }
}
