import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { CdkStepper } from '@angular/cdk/stepper';

interface StepChangeEvent {
  selectedIndex: number;
}

@Component({
  selector: 'aqm-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CdkStepper, useExisting: StepperComponent }],
})
export class StepperComponent extends CdkStepper implements OnChanges {
  @ContentChild('headerTemplate') headerTemplate?: TemplateRef<any>;

  @Input() displayHeader: boolean = false;
  @Input() displayFooter: boolean = false;
  @Input() stepIndex!: number;

  @Output() setStepperProperties: EventEmitter<StepChangeEvent> =
    new EventEmitter();

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes?.stepIndex) {
      this.selectStepByIndex(changes?.stepIndex.currentValue - 1);
    }
  }

  /**
   * Allows to select step based on index, not by ordering
   */
  public selectStepByIndex(index: number): void {
    this.selectedIndex = index;
  }

  // implement custom logic using CdkStepper hook
  public _stateChanged(): void {
    this.setStepperProperties.emit({ selectedIndex: this.selectedIndex + 1 });
  }
}
