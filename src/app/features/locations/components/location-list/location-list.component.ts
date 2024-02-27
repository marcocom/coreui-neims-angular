import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Location } from '@api/types';
import { LocationTypeEnum, LocationVisibilityEnum } from '@api/enums';
import { TranslationService } from '@core/services';
import { LocationsFilters } from '@locations/types';

@Component({
  selector: 'aqm-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public locations!: Location[];

  @Input() public defaultFilters!: LocationsFilters;

  @Input() public loading: boolean = false;

  @Output() public locationMouseEnter = new EventEmitter<string>();

  @Output() public locationMouseLeave = new EventEmitter<string>();

  @Output() public locationClick = new EventEmitter<string>();

  @Output() public addLocationNavigate = new EventEmitter<void>();

  @Output() public filtersChange = new EventEmitter<LocationsFilters>();

  public readonly locationTypeOptions = Object.values(LocationTypeEnum).map(
    (value) => ({
      name: this.translationService.getTranslation('location-type', value),
      value,
    })
  );

  public readonly visibilityOptions = Object.values(LocationVisibilityEnum).map(
    (value) => ({
      name: this.translationService.getTranslation(
        'location-visibility',
        value
      ),
      value,
    })
  );

  public readonly linkingOptions = [
    {
      name: $localize`:location-list|Label for linked option:Linked`,
      value: true,
    },
    {
      name: $localize`:location-list|Label for unlinked option:Unlinked`,
      value: false,
    },
  ];

  public filtersForm!: FormGroup;

  public get filtersFormValue(): LocationsFilters {
    return this.filtersForm.value;
  }

  public get filterSelected(): boolean {
    return Object.values(this.filtersFormValue).some((value) => value !== null);
  }

  private readonly unsubscribe$ = new Subject<void>();

  constructor(
    private translationService: TranslationService,
    private fb: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.filtersForm = this.fb.group({
      locationType: this.defaultFilters.locationType,
      visibility: this.defaultFilters.visibility,
      linking: this.defaultFilters.linking,
    });

    if (this.loading) {
      this.filtersForm.disable();
    }

    this.filtersForm.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((formValue: LocationsFilters) => {
        this.filtersChange.next(formValue);
      });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.loading && !changes.loading.firstChange) {
      if (this.loading) {
        this.filtersForm.disable();
      } else {
        this.filtersForm.enable();
      }
    }
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public resetFilters(): void {
    this.filtersForm.reset({
      locationType: null,
      visibility: null,
      linking: null,
    });
  }

  public onAddLocation(): void {
    this.addLocationNavigate.emit();
  }

  public onMouseEnter(location: Location): void {
    this.locationMouseEnter.emit(location.gisId);
  }

  public onMouseLeave(location: Location): void {
    this.locationMouseLeave.emit(location.gisId);
  }

  public onClick(location: Location): void {
    this.locationClick.emit(location.gisId);
  }

  public trackByFunc(index: number, location: Location): string | number {
    return location.uuid;
  }
}
