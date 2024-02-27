import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Location } from '@api/types';

@Component({
  selector: 'aqm-location-data',
  templateUrl: './location-data.component.html',
  styleUrls: ['./location-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationDataComponent {
  @Input() public location!: Location;

  @Input() public images!: string[];

  public readonly defaultImagePath: string =
    'assets/images/location-generic.png';
}
