export enum MetricType {
  VISIT = 'VISIT',
  // Add other metric types as needed
}

export interface Metric {
  id: string;
  type: MetricType;
  path: string;
  userId?: string;
  userAgent?: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface MetricCount {
  count: number;
}

export interface MetricPeriod {
  day: Metric[];
  week: Metric[];
  month: Metric[];
  year: Metric[];
}
