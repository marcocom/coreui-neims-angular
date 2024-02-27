import { LocationTypeEnum, LocationVisibilityEnum } from '@api/enums';
import { Station } from '@api/types/station';

export interface LocationImage {
  fileId: string;
  fileName: string;
  fileUrl: string;
}
export interface Location {
  latitude: string;
  longitude: string;
  name: string;
  type: LocationTypeEnum;
  visibility: LocationVisibilityEnum;
  altitude?: string;
  description?: string;
  uuid: UUIDv4;
  gisId: string;
  station?: Station;
  images?: LocationImage[];
}
