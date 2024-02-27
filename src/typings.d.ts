declare global {
  type Params<T = any> = Record<string, T>;

  type Primitive = string | number | boolean;

  type Nullable<T> = T | null | undefined;

  type UUIDv4 = string;

  type GeoJSON = any;
}

export {};
