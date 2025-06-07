import { Badge, BadgeStatus } from '@feat/public/badge/interface/badge.interface';

export const STATIC_BADGE: Badge = {
  id: 'badge-001',
  status: BadgeStatus.DISPONIBLE, // DISPONIBLE_A_PARTIR_DE | INDISPONIBLE
  availableUntil: new Date('2025-06-15'),
  isAvailable: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};
