export enum LocationVisibilityEnum {
  Unpublished = 'UNPUBLISHED',
  Published = 'PUBLISHED',
}

export const LocationVisibilityEnumI18n: Record<
  LocationVisibilityEnum,
  string
> = Object.freeze({
  UNPUBLISHED: $localize`:Location visibility - Unpublished:Unpublished`,
  PUBLISHED: $localize`:Location visibility - Published:Published`,
});
