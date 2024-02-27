import { StationTypeEnum, StationVisibilityEnum } from '@api/enums';

export interface Station {
  uuid: UUIDv4;
  serialNumber: string;
  locationId: string;
  capabilities: string[];
  type: StationTypeEnum;
  visibility: StationVisibilityEnum;
  manufacturerName: string;
  notes: string;
}
