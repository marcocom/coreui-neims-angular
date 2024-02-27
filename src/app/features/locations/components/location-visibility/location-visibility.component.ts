import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { LocationVisibilityEnum } from '@api/enums';

@Component({
  selector: 'aqm-location-visibility',
  templateUrl: './location-visibility.component.html',
  styleUrls: ['./location-visibility.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationVisibilityComponent {
  @Input() public visibility!: LocationVisibilityEnum;

  public readonly LOCATION_VISIBILITY = LocationVisibilityEnum;
}
