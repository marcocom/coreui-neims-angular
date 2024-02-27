import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';

@Component({
  selector: 'aqm-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainerComponent {
  @Input()
  @HostBinding('class.with-header')
  public header: boolean = true;

  @Input()
  @HostBinding('class.with-sidebar')
  public sidebar: boolean = true;
}
