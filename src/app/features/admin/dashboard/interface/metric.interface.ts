export enum MetricType {
  VISIT = 'VISIT',
  CV_CLICK = 'CV_CLICK',
}

/**
 * Interface for metric metadata
 * Replaces 'any' type with a more specific structure
 */
export interface MetricMetadata {
  // Common metadata fields
  referrer?: string;
  browser?: string;
  os?: string;
  device?: string;

  // CV click specific metadata
  heroId?: string;
  cvName?: string;

  // Visit specific metadata
  visitDuration?: number;
  pageTitle?: string;

  // Allow for additional properties with string values
  [key: string]: string | number | boolean | undefined;
}

export interface Metric {
  id: string;
  type: MetricType;
  path: string;
  userId?: string;
  userAgent?: string;
  ipAddress?: string;
  metadata?: MetricMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface MetricCount {
  count: number;
}
