import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { debounce } from '@app/utils';

@Component({
  selector: 'aqm-table-search',
  templateUrl: './table-search.component.html',
  styleUrls: ['./table-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableSearchComponent {
  @Input() placeholder!: string;

  @Output() search: EventEmitter<string> = new EventEmitter();

  public searchString: string = '';
  public processInput = debounce(this.onSearch, this);

  public onClear(): void {
    this.searchString = '';
  }

  private onSearch() {
    this.search.emit(this.searchString);
  }
}
