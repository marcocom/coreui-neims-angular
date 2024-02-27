export enum LocationTypeEnum {
  Indoor = 'INDOOR',
  Outdoor = 'OUTDOOR',
}

export const LocationTypeEnumI18n: Record<LocationTypeEnum, string> =
  Object.freeze({
    INDOOR: $localize`:Location type - Indoor:Indoor`,
    OUTDOOR: $localize`:Location type - Outdoor:Outdoor`,
  });
