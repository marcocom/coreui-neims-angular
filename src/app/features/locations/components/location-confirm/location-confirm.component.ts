import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { Location } from '@api/types';
import { LocationsViewType } from '@locations/types';

@Component({
  selector: 'aqm-location-confirm',
  templateUrl: './location-confirm.component.html',
  styleUrls: ['./location-confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationConfirmComponent implements OnChanges {
  @Input() public location!: Location;
  @Input() public type!: LocationsViewType;

  public images: string[] = [];

  public ngOnChanges(changes: SimpleChanges): void {
    if (!changes.location) return;

    this.images = this.location?.images?.map((image) => image.fileUrl) ?? [];
  }
}
