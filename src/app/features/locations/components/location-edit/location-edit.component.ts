import {
  EventEmitter,
  Component,
  Input,
  Output,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Inject,
} from '@angular/core';

import { Location } from '@api/types';
import { ENVIRONMENT } from '@core/providers';
import { Environment } from '@core/types';
import { LocationWizardStepEnum } from '@locations/enums';

@Component({
  selector: 'aqm-location-edit',
  templateUrl: './location-edit.component.html',
  styleUrls: ['./location-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationEditComponent {
  @Input() public location!: Location;

  @Output() public stepChange = new EventEmitter<LocationWizardStepEnum>();
  @Output() public editedLocationSet = new EventEmitter<void>();
  @Output() public resetToInitial = new EventEmitter<Partial<Location>>();
  @Output() public editLocation = new EventEmitter<void>();
  @Output() public navigateBack = new EventEmitter<Partial<Location>>();
  @Output() public storeLocationData = new EventEmitter<Partial<Location>>();

  public currentStep: LocationWizardStepEnum = 1;
  public alowFormSubmit: boolean = false;

  private initialCoordinates!: Partial<Location>;

  public readonly UPLOAD_URL = this.env.mediaServiceUrl;

  constructor(
    @Inject(ENVIRONMENT)
    private env: Environment,
    private cdRef: ChangeDetectorRef
  ) {}

  public onEditLocationSet(): void {
    this.editedLocationSet.emit();
  }

  public onBackNavigate(): void {
    this.navigateBack.emit(this.initialCoordinates);
  }

  public onConfirmNavigate(): void {
    this.currentStep = LocationWizardStepEnum.Confirmation;
    this.cdRef.detectChanges();
  }

  public onFormNavigate(): void {
    this.currentStep = 1;
    this.cdRef.detectChanges();
  }

  public onSetCurrentStep(properties: Record<string, number>): void {
    this.stepChange.emit(properties.selectedIndex);
  }

  public onStoreLocationData(locationData: Partial<Location>): void {
    this.storeLocationData.emit(locationData);
  }

  public onConfirmationProceed(alowFormSubmit: boolean): void {
    this.alowFormSubmit = alowFormSubmit;
  }

  public onEditLocation(): void {
    this.editLocation.emit();
  }

  public resetCoordinates(): void {
    this.resetToInitial.emit(this.initialCoordinates);
  }

  public onInitialCoordinatesSet(coordinates: Partial<Location>): void {
    this.initialCoordinates = coordinates;
  }
}
