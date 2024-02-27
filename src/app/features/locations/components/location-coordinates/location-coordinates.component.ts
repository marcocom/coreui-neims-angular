import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { Location } from '@app/api/types';

@Component({
  selector: 'aqm-location-coordinates',
  templateUrl: './location-coordinates.component.html',
  styleUrls: ['./location-coordinates.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationCoordinatesComponent implements OnChanges {
  @Input() type!: 'add' | 'edit';
  @Input() coordinates!: Partial<Location>;

  @Output() setInitialCoordinates = new EventEmitter<Partial<Location>>();

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.coordinates.firstChange &&
      changes.coordinates?.currentValue?.latitude
    ) {
      const { latitude, longitude } = changes.coordinates.currentValue;

      this.setInitialCoordinates.emit({ latitude, longitude });
    }
  }
}
