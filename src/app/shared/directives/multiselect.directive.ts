import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { MultiSelect } from 'primeng/multiselect';

@Directive({
  selector: '[aqmMultiselect]',
})
export class MultiselectDirective implements AfterViewInit, OnDestroy {
  private sub!: Subscription;

  public get overlay(): HTMLDivElement {
    return this.multiselect.overlay;
  }

  constructor(
    private host: ElementRef<HTMLElement>,
    private multiselect: MultiSelect,
    private renderer: Renderer2
  ) {}

  public ngAfterViewInit(): void {
    this.sub = this.multiselect.onPanelShow.subscribe(() => {
      if (this.multiselect.appendTo === 'body') {
        const { left, width } = this.host.nativeElement.getBoundingClientRect();

        this.renderer.setStyle(this.overlay, 'max-width', width + 'px');
        this.renderer.setStyle(this.overlay, 'left', left + 'px');
      }

      const { top: overlayY } = this.overlay.getBoundingClientRect();
      const { top: hostY } = this.host.nativeElement.getBoundingClientRect();

      if (overlayY > hostY) {
        this.renderer.addClass(this.overlay, 'overlay-bottom');
      } else {
        this.renderer.addClass(this.overlay, 'overlay-top');
      }
    });
  }

  public ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
