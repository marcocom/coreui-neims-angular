import { LocationTypeEnum, LocationVisibilityEnum } from '@api/enums';

export interface LocationsFilters {
  locationType: Nullable<LocationTypeEnum>;
  visibility: Nullable<LocationVisibilityEnum>;
  linking: Nullable<boolean>;
}
