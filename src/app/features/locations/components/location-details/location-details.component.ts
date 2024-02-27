import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';

import { Location } from '@api/types';
import { StationVisibilityEnum } from '@api/enums';
import { TranslationService } from '@core/services';

@Component({
  selector: 'aqm-location-details',
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationDetailsComponent {
  @Input() public location!: Location;

  @Output() public navigateBack = new EventEmitter<void>();
  @Output() public editLocation = new EventEmitter<Location>();
  @Output() public deleteLocation = new EventEmitter<UUIDv4>();

  public images: string[] = [];

  public readonly stationVisibilityOptions = Object.values(
    StationVisibilityEnum
  ).map((value) => ({
    name: this.translationService.getTranslation('station-visibility', value),
    value,
  }));

  constructor(private translationService: TranslationService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (!changes.location) return;

    this.images = this.location?.images?.map((image) => image.fileUrl) ?? [];
  }

  public onLinkUnit(location: Location): void {
    // TODO: implement later
  }

  public onUnlinkUnit(location: Location): void {
    // TODO: implement later
  }

  public onEdit(location: Location): void {
    this.editLocation.emit(location);
  }

  public onDelete(location: Location): void {
    this.deleteLocation.emit(location.uuid);
  }

  public onNavigateBack(): void {
    this.navigateBack.emit();
  }
}
