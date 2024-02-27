import { LocationVisibilityEnum, LocationTypeEnum } from '@api/enums';

export interface QueryParams {
  [name: string]:
    | string
    | number
    | boolean
    | ReadonlyArray<string | number | boolean>;
}

export interface PageParams extends QueryParams {
  page: number;
  size: number;
}

export interface LocationsParams extends QueryParams {
  visibility: LocationVisibilityEnum;
  type: LocationTypeEnum;
  hasLinkedStations: boolean;
}

export interface LocationsFilters {
  capabilities: string[];
  locationIds: UUIDv4[];
}

export interface MetricsFilters {
  fromDate: string;
  toDate: string;
  serialNumbers: string[];
  capabilities: string[];
}
