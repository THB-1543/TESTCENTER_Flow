import { BookingStatus } from '../types';

export const statusColors: Record<BookingStatus, { bg: string; text: string; label: string }> = {
  geplant: { bg: '#3B82F6', text: '#fff', label: 'Geplant' },
  aktiv: { bg: '#22C55E', text: '#fff', label: 'Aktiv' },
  ruestzeit: { bg: '#EAB308', text: '#000', label: 'Rüstzeit' },
  wartung: { bg: '#F97316', text: '#fff', label: 'Wartung' },
  stoerung: { bg: '#EF4444', text: '#fff', label: 'Störung' },
  abgeschlossen: { bg: '#6B7280', text: '#fff', label: 'Abgeschlossen' },
};
