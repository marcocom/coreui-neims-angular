import { Injectable } from '@angular/core';

import {
  LocationTypeEnumI18n,
  LocationVisibilityEnumI18n,
  StationVisibilityEnumI18n,
} from '@api/enums';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private groups: Record<string, Record<string, string>> = {};

  constructor() {
    this.setGroup('location-type', LocationTypeEnumI18n);
    this.setGroup('location-visibility', LocationVisibilityEnumI18n);
    this.setGroup('station-visibility', StationVisibilityEnumI18n);
  }

  public setGroup(groupKey: string, group: Record<string, string>): void {
    this.groups[groupKey] = group;
  }

  public getTranslation(groupKey: string, key: string): string {
    return this.groups[groupKey]?.[key] ?? `${groupKey}.${key}`;
  }
}
