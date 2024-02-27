import { Injectable, Injector } from '@angular/core';

import * as L from 'leaflet';
import { MapApiService } from './map-api.service';

@Injectable({
  providedIn: 'root',
})
export class MapRegistryService {
  private readonly mapRegistry: Map<string, L.Map> = new Map();
  private readonly mapApiRegistry: Map<string, MapApiService> = new Map();

  constructor(private injector: Injector) {}

  public addMap(mapKey: string, map: L.Map): void {
    if (this.mapRegistry.has(mapKey)) {
      throw new Error('mapKey must be unique');
    }

    this.mapRegistry.set(mapKey, map);
    this.mapApiRegistry.set(mapKey, new MapApiService(map, this.injector));
  }

  public getMap(mapKey: string): Nullable<L.Map> {
    return this.mapRegistry.get(mapKey) ?? null;
  }

  public getApi(mapKey: string): Nullable<MapApiService> {
    return this.mapApiRegistry.get(mapKey) ?? null;
  }

  public removeMap(mapKey: string): void {
    this.mapRegistry.delete(mapKey);
    this.mapApiRegistry.delete(mapKey);
  }
}
