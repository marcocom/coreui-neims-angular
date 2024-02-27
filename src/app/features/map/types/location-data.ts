import { Metrics } from '@api/types';
import { MapFilters } from '@map/types/map-filters';

export interface LocationData {
  name: string;
  uuid: UUIDv4;
  metrics: Nullable<Metrics>;
  filters: MapFilters;
}
