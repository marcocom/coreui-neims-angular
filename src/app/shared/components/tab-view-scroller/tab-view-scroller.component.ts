import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  OnDestroy,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TabView } from 'primeng/tabview';

@Component({
  selector: 'aqm-tab-view-scroller',
  templateUrl: './tab-view-scroller.component.html',
  styleUrls: ['./tab-view-scroller.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabViewScrollerComponent implements AfterViewInit, OnDestroy {
  @ContentChild(TabView)
  private tabViewComponent!: TabView;

  public get activeIndex(): number {
    return this.tabViewComponent.activeIndex ?? 0;
  }

  public get tabsCount(): number {
    return this.tabViewComponent.tabs.length;
  }

  public get tabViewElem(): HTMLElement {
    return this.tabViewComponent.el.nativeElement;
  }

  private readonly unsubscribe$: Subject<void> = new Subject();

  public ngAfterViewInit(): void {
    this.tabViewComponent.activeIndexChange
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((activeIndex) => {
        this.tabViewComponent.activeIndex = activeIndex;
      });
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public navigateBack(): void {
    this.setActiveIndex(this.activeIndex - 1);
  }

  public navigateForward(): void {
    this.setActiveIndex(this.activeIndex + 1);
  }

  private setActiveIndex(index: number): void {
    if (index < 0 || index >= this.tabsCount) return;

    this.tabViewComponent.activeIndex = index;
    this.tabViewComponent.cd.markForCheck();

    this.tabViewElem
      .querySelectorAll('.p-tabview-nav-link')
      .item(this.activeIndex)
      .scrollIntoView({ block: 'center' });
  }
}
