export interface MapOptions {
  mapKey: string;
  tileServerUrl: string;
  attribution: string;
  center: [number, number];
  zoom: number;
  minZoom?: number;
  maxZoom?: number;
}

export type LayerEventAction = 'click' | 'mouseover' | 'mouseout' | 'dragend';

export interface LayerEvent<T = any> {
  layerName: string;
  action: LayerEventAction;
  props: T;
}
export interface LayerGisEvent extends LayerEvent {
  pid: string;
}

export interface MapTooltip<T = any> {
  onTooltipInit(data: T): void;
}
