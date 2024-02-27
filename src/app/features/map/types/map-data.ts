import { Location, Metrics } from '@api/types';

export interface MapData {
  geo: GeoJSON;
  gisLocations: Record<string, Location>;
  metricsPerLocation: Record<string, Metrics>;
}
