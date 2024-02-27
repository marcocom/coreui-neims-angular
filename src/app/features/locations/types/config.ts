import { Location } from '@api/types';
import { LocationMarkerEventTypeEnum } from '@locations/enums';

export type LocationsViewType = 'list' | 'details' | 'add' | 'edit';

export interface LocationMarkerEvent {
  action: LocationMarkerEventTypeEnum;
  pid: string;
  location: Location;
}
