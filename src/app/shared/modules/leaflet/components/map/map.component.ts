import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { fromEvent, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import * as L from 'leaflet';

import { MapOptions } from '@shared/modules/leaflet/config';
import {
  LegendControl,
  addCustomControl,
} from '@shared/modules/leaflet/extensions';
import { MapRegistryService } from '@shared/modules/leaflet/services';

@Component({
  selector: 'aqm-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') private mapContainer!: ElementRef<HTMLElement>;

  @Input() public customControl!: HTMLElement;
  @Input() public options!: MapOptions;
  @Input() public legend: Nullable<TemplateRef<any>>;
  @Input() public displayCustomControl: boolean = false;

  @Output() public mapInitialized: EventEmitter<void> = new EventEmitter();

  public mapKey: string | undefined;

  private map: L.Map | undefined;
  private readonly unsubscribe$ = new Subject<void>();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private zone: NgZone,
    private mapRegistryService: MapRegistryService
  ) {}

  public ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.initMap(this.options);

      fromEvent(this.document, 'click')
        .pipe(
          filter((event) => {
            return !this.mapContainer.nativeElement.contains(
              event.target as Node
            );
          }),
          takeUntil(this.unsubscribe$)
        )
        .subscribe(() => {
          this.clickedOutside();
        });
    });
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    if (this.mapKey) {
      const mapApi = this.mapRegistryService.getApi(this.mapKey);
      mapApi?.removeAllLayers();
      this.mapRegistryService.removeMap(this.mapKey);
    }

    this.map?.off();
    this.map?.remove();
  }

  private initMap(options: MapOptions): void {
    const {
      mapKey,
      tileServerUrl,
      attribution,
      center,
      zoom,
      minZoom = 3,
      maxZoom = 18,
    } = options;

    if (!mapKey) {
      throw new Error('mapKey must be provided');
    }

    this.map = L.map(this.mapContainer.nativeElement, {
      center,
      zoom,
      zoomControl: false,
    });

    const tileLayer = L.tileLayer(tileServerUrl, {
      attribution,
      minZoom,
      maxZoom,
    });

    tileLayer.addTo(this.map);

    L.control
      .zoom({
        position: 'topright',
      })
      .addTo(this.map);

    if (this.legend) {
      const legendControl = new LegendControl({ position: 'bottomright' });
      legendControl.addTo(this.map);
    }

    if (this.customControl) {
      const customControl = addCustomControl(this.customControl, 'topright');
      customControl.addTo(this.map);
    }

    this.mapKey = mapKey;
    this.mapRegistryService.addMap(this.mapKey, this.map);
    this.mapInitialized.emit();
  }

  private clickedOutside(): void {
    this.map?.closePopup();
  }
}
