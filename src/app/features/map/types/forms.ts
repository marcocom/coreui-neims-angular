import { Location, Capability } from '@api/types';

export interface MapFiltersFormValue {
  locations: Location[];
  capabilities: Capability[];
  dateRange: Nullable<Date[]>;
}
