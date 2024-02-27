export enum StationVisibilityEnum {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

export const StationVisibilityEnumI18n: Record<StationVisibilityEnum, string> =
  Object.freeze({
    ACTIVE: $localize`:Station visibility - Active:Active`,
    INACTIVE: $localize`:Station visibility - Inactive:Inactive`,
  });
