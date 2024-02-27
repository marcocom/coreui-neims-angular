export interface Metrics {
  serialNumber: string;
  measurementDate?: string;
  score: number;
  metrics: Record<string, number>;
}
