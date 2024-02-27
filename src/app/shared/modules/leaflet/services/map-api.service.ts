import {
  ApplicationRef,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Injector,
  NgZone,
  Type,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';

import * as L from 'leaflet';

import {
  LayerEvent,
  LayerEventAction,
  LayerGisEvent,
  MapTooltip,
} from '@shared/modules/leaflet/config';
import { Markers } from '@shared/modules/leaflet/extensions';

const TOOLTIP_REF_KEY = Symbol('tooltipRef');

const POPUP_OPTIONS: L.PopupOptions = {
  closeOnClick: true,
};

interface GeoJSONOptions extends L.GeoJSONOptions {
  radius?: number;
  pointLayerIcon?: (props: any) => L.Icon | L.DivIcon;
}

export class MapApiService {
  private layers: Map<string, L.Layer> = new Map();
  private childLayers: Map<string, Readonly<Record<string, L.Layer>>> =
    new Map();
  private applicationRef: ApplicationRef;
  private componentFactoryResolver: ComponentFactoryResolver;
  private ngZone: NgZone;
  private _layerEvent$ = new Subject<LayerEvent | LayerGisEvent>();

  public get layerEvent$(): Observable<LayerEvent | LayerGisEvent> {
    return this._layerEvent$.asObservable();
  }

  constructor(private map: L.Map, private injector: Injector) {
    this.applicationRef = this.injector.get(ApplicationRef);
    this.componentFactoryResolver = this.injector.get(ComponentFactoryResolver);
    this.ngZone = this.injector.get(NgZone);
  }

  public createLayer(
    name: string,
    geojson: GeoJSON,
    options?: GeoJSONOptions,
    tooltip?: Type<MapTooltip>
  ): void {
    const tooltipFactory = tooltip
      ? this.componentFactoryResolver.resolveComponentFactory(tooltip)
      : null;

    const childLayers: Record<string, L.Layer> = {};

    const layer = L.geoJSON(geojson, {
      pointToLayer: (feature, { lat, lng }) => {
        if (!options?.pointLayerIcon) {
          return Markers.createCircleMarker(lat, lng);
        }

        return Markers.createMarker([lat, lng], {
          icon: options.pointLayerIcon(feature.properties),
        });
      },
      onEachFeature: (feature, layer) => {
        childLayers[feature.properties.pid] = layer;

        if (tooltipFactory) {
          const tooltipRef = this.createTooltip(
            tooltipFactory,
            feature.properties
          );

          this.setTooltipRef(layer, tooltipRef);

          const popup = L.popup(POPUP_OPTIONS);
          popup.setContent(tooltipRef.location.nativeElement);
          layer.bindPopup(popup);
        }
      },
      ...options,
    });

    this.addLayerListeners(name, layer);
    layer.addTo(this.map);

    this.layers.set(name, layer);
    this.childLayers.set(name, Object.freeze(childLayers));
  }

  public createMarkerLayer(
    name: string,
    coordinates: L.LatLngExpression,
    options: L.MarkerOptions = {}
  ): void {
    const marker = Markers.createMarker(coordinates, options);

    this.addLayerListeners(name, marker);
    marker.addTo(this.map);
    this.layers.set(name, marker);
  }

  public getLayer<T extends L.Layer>(name: string): Nullable<T> {
    return this.layers.get(name) as Nullable<T>;
  }

  public removeLayer(name: string): void {
    const layer = this.layers.get(name);

    if (!layer) return;

    this.childLayers.delete(name);

    if (layer instanceof L.GeoJSON) {
      for (const childLayer of layer.getLayers()) {
        const tooltipRef = this.getTooltipRef(childLayer);

        if (tooltipRef) {
          childLayer.setPopupContent('');
          childLayer.unbindPopup();
          this.clearTooltipRef(childLayer);
          tooltipRef.destroy();
          childLayer.remove();
        }
      }
    }

    this.layers.delete(name);
    layer.off();
    layer.remove();
  }

  public removeAllLayers(): void {
    for (const key of this.layers.keys()) {
      this.removeLayer(key);
    }
  }

  public getChildLayer<T extends L.Layer>(
    layer: string,
    pid?: string
  ): Nullable<T> | Record<string, L.Layer> {
    return pid
      ? (this.childLayers.get(layer)?.[pid] as T) ?? null
      : this.childLayers.get(layer);
  }

  public setEventListener(
    action: LayerEventAction,
    layerName: string,
    layer: L.Layer
  ): void {
    this.addEventListener(action, layerName, layer);
  }

  private createTooltip(
    factory: ComponentFactory<MapTooltip>,
    data: any
  ): ComponentRef<MapTooltip> {
    const componentRef = factory.create(this.injector);
    this.applicationRef.attachView(componentRef.hostView);

    componentRef.instance.onTooltipInit(data);

    return componentRef;
  }

  private setTooltipRef(
    layer: any,
    tooltipRef: ComponentRef<MapTooltip>
  ): void {
    layer[TOOLTIP_REF_KEY] = tooltipRef;
  }

  private getTooltipRef(layer: any): Nullable<ComponentRef<MapTooltip>> {
    return layer[TOOLTIP_REF_KEY];
  }

  private clearTooltipRef(layer: any): void {
    layer[TOOLTIP_REF_KEY] = null;
  }

  private addLayerListeners(layerName: string, layer: L.Layer): void {
    this.addEventListener('click', layerName, layer);
    this.addEventListener('mouseover', layerName, layer);
    this.addEventListener('mouseout', layerName, layer);
    this.addEventListener('dragend', layerName, layer);
  }

  private addEventListener(
    action: LayerEventAction,
    layerName: string,
    layer: L.Layer
  ): void {
    layer.on(action, (event) => {
      this.ngZone.run(() => {
        if (layer instanceof L.GeoJSON) {
          const props = event.propagatedFrom.feature.properties;

          this._layerEvent$.next({
            action,
            layerName,
            pid: String(props.pid),
            props,
          });
        } else {
          const props = event.target._latlng;

          this._layerEvent$.next({
            action,
            layerName,
            props,
          });
        }
      });
    });
  }
}
