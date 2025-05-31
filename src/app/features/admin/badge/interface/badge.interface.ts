export interface Badge {
  id: string;
  status: BadgeStatus;
  availableUntil: Date | null;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum BadgeStatus {
  DISPONIBLE = 'DISPONIBLE',
  INDISPONIBLE = 'INDISPONIBLE',
  DISPONIBLE_A_PARTIR_DE = 'DISPONIBLE_A_PARTIR_DE',
}
