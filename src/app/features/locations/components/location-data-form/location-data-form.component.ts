import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { LocationTypeEnum, LocationVisibilityEnum } from '@api/enums';
import { Location, LocationImage } from '@api/types';
import { TEXTAREA_MAX_SIZE, INPUT_MAX_SIZE } from '@app/constants';
import { DialogUIService } from '@layout/services/dialog.service';
import { LocationsViewType } from '@locations/types';
import {
  FileRemovedEvent,
  FileUploadedEvent,
  FileUploadError,
} from '@shared/types';

@Component({
  selector: 'aqm-location-data-form',
  templateUrl: './location-data-form.component.html',
  styleUrls: ['./location-data-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationDataFormComponent implements OnInit, OnDestroy {
  @Input() public location!: Location;
  @Input() public type!: LocationsViewType;
  @Input() public uploadUrl!: string;

  @Output() public storeLocationData = new EventEmitter<Partial<Location>>();
  @Output() public proceedToConfirmation = new EventEmitter<boolean>();
  @Output() public setEditableLocation = new EventEmitter<Location>();

  public locationDetailsForm!: FormGroup;
  public uploadedPictures: LocationImage[] = [];

  public readonly LOCATION_TYPE = LocationTypeEnum;
  public readonly LOCATION_VISIBILITY = LocationVisibilityEnum;
  public readonly INPUT_MAX_SIZE = INPUT_MAX_SIZE;
  public readonly TEXTAREA_MAX_SIZE = TEXTAREA_MAX_SIZE;
  public readonly MAX_FILE_SIZE_VALUE = 50 * 1024 * 1024; // 50Mb
  public readonly MAX_FILE_SIZE_LABEL = '50Mb';
  public readonly ALTITUDE_LIMIT = 20000;

  public get formValue(): Partial<Location> {
    return {
      ...this.locationDetailsForm.value,
      images: this.uploadedPictures,
    };
  }

  public get name(): AbstractControl {
    return this.locationDetailsForm.get('name') as AbstractControl;
  }

  public get altitude(): Nullable<AbstractControl> {
    return this.locationDetailsForm.get('altitude');
  }

  private readonly unsubscribe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private dialogUIService: DialogUIService
  ) {}

  public ngOnInit(): void {
    this.initForm();
    if (this.type === 'edit') {
      this.proceedToConfirmation.emit(true);
    }

    this.locationDetailsForm.valueChanges
      .pipe(debounceTime(300), takeUntil(this.unsubscribe$))
      .subscribe(() => this.onFormDataChanged());

    this.uploadedPictures = this.location?.images ?? [];
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public onFileUploaded(event: FileUploadedEvent<LocationImage>): void {
    this.uploadedPictures = [
      ...this.uploadedPictures,
      {
        fileId: event.response.fileId,
        fileName: event.fileName,
        fileUrl: `${this.uploadUrl}/${event.response.fileId}`,
      },
    ];
    this.onFormDataChanged();
  }

  public onFileRemoved(event: FileRemovedEvent<LocationImage>): void {
    this.uploadedPictures = this.uploadedPictures.filter(
      (file) => file.fileId !== event.file.fileId
    );
    this.onFormDataChanged();
  }

  public onFileUploadError(error: FileUploadError): void {
    const message = this.getDialogMessage(error);

    this.dialogUIService.openConfirm({
      header: $localize`:File upload failed dialog title|:Upload failed`,
      message,
      rejectVisible: false,
      acceptLabel: $localize`:File upload failed dialog action label|:Try again`,
    });
  }

  public setLocationMarker(location: Location): void {
    this.setEditableLocation.emit(location as Location);
  }

  private initForm(): void {
    this.locationDetailsForm = this.fb.group({
      altitude: [
        this.location?.altitude || null,
        [
          Validators.min(-this.ALTITUDE_LIMIT),
          Validators.max(this.ALTITUDE_LIMIT),
        ],
      ],
      name: [this.location?.name || '', Validators.required],
      description: [this.location?.description || '', Validators.required],
      type: [this.location?.type || null, Validators.required],
      visibility: [this.location?.visibility || null, Validators.required],
    });
  }

  private onFormDataChanged(): void {
    if (this.locationDetailsForm.valid) {
      this.storeLocationData.emit(this.formValue);
      this.proceedToConfirmation.emit(true);
    } else {
      this.proceedToConfirmation.emit(false);
    }
  }

  private getDialogMessage(error: FileUploadError): string {
    switch (error.type) {
      case 'canceled':
        return $localize`:Image upload error message - Cancel:File upload was canceled.`;
      case 'http':
        return $localize`:Image upload error message - HTTP:Server error occurred. Please try later.`;
      case 'maxSizeExceeded':
        return $localize`:Image upload error message - Max size:The image size is too big. Maximum file size is ${this.MAX_FILE_SIZE_LABEL}.`;
      case 'wrongDimensions':
        return $localize`:Image upload error message - Dimension:File you choose has wrong dimensions. Please select another one.`;
    }
  }
}
