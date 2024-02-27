import {
  Component,
  EventEmitter,
  Output,
  Input,
  ChangeDetectionStrategy,
  Inject,
} from '@angular/core';

import { Location } from '@api/types';
import { ENVIRONMENT } from '@core/providers';
import { Environment } from '@core/types';
import { LocationWizardStepEnum } from '@locations/enums';

@Component({
  selector: 'aqm-location-add',
  templateUrl: './location-add.component.html',
  styleUrls: ['./location-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationAddComponent {
  @Input() public location!: Partial<Location>;
  @Input() public markerAdded: boolean = false;

  @Output() public stepChange = new EventEmitter<LocationWizardStepEnum>();
  @Output() public navigateBack = new EventEmitter<void>();
  @Output() public addLocation = new EventEmitter<void>();
  @Output() public storeLocationData = new EventEmitter<Partial<Location>>();

  public alowFormSubmit: boolean = false;
  public currentStep: LocationWizardStepEnum =
    LocationWizardStepEnum.SetCoordinates;
  public readonly stepsTotal: number = 3;
  public readonly UPLOAD_URL = this.env.mediaServiceUrl;

  constructor(
    @Inject(ENVIRONMENT)
    private env: Environment
  ) {}

  public onSetCurrentStep(properties: Record<string, number>) {
    this.currentStep = properties.selectedIndex;
    this.stepChange.emit(this.currentStep);
  }

  public onNavigateBack(): void {
    this.navigateBack.emit();
  }

  public onConfirmationProceed(alowFormSubmit: boolean): void {
    this.alowFormSubmit = alowFormSubmit;
  }

  public onStoreLocationData(locationData: Partial<Location>): void {
    this.storeLocationData.emit(locationData);
  }

  public onAddLocation(): void {
    this.addLocation.emit();
  }
}
