import { Pipe, PipeTransform } from '@angular/core';

import { TranslationService } from '@core/services';

@Pipe({ name: 'translate' })
export class TranslatePipe implements PipeTransform {
  constructor(private translationService: TranslationService) {}

  public transform(key: string, groupKey: string): string {
    return this.translationService.getTranslation(groupKey, key);
  }
}
