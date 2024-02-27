import { Location } from '@api/types';

export interface LocationsData {
  geo: GeoJSON;
  gisLocations: Record<string, Location>;
}
