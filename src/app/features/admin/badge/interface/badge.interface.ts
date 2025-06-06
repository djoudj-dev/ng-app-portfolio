export interface Badge {
  id: string;
  status: BadgeStatus;
  availableUntil: Date | null;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface for badge API response
 * Used to replace 'any' type in transformBadge method
 */
export interface BadgeResponse {
  id: string;
  status: BadgeStatus;
  availableUntil: string | null;
  isAvailable?: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum BadgeStatus {
  DISPONIBLE = 'DISPONIBLE',
  INDISPONIBLE = 'INDISPONIBLE',
  DISPONIBLE_A_PARTIR_DE = 'DISPONIBLE_A_PARTIR_DE',
}
