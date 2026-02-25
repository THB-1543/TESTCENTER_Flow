export type BookingStatus = 'geplant' | 'aktiv' | 'ruestzeit' | 'wartung' | 'stoerung' | 'abgeschlossen';

export interface Pruefstand {
  id: string;
  name: string;
  typ: string;
  kapazitaet: string;
  standort: string;
  status: 'verfuegbar' | 'belegt' | 'wartung';
  beschreibung: string;
}

export interface Equipment {
  id: string;
  name: string;
  typ: string;
  seriennummer: string;
  status: 'verfuegbar' | 'im_einsatz' | 'wartung' | 'defekt';
  naechsteWartung: string;
  beschreibung: string;
}

export interface Mitarbeiter {
  id: string;
  name: string;
  rolle: string;
  email: string;
  qualifikationen: string[];
  verfuegbarkeit: 'verfuegbar' | 'im_einsatz' | 'urlaub' | 'krank';
}

export interface Projekt {
  id: string;
  name: string;
  auftraggeber: string;
  status: 'aktiv' | 'geplant' | 'abgeschlossen';
  beschreibung: string;
}

export interface Buchung {
  id: string;
  projektId: string;
  pruefstandId: string;
  titel: string;
  startDatum: string;
  endDatum: string;
  ruestzeit: number;
  pruefzeit: number;
  abbauzeit: number;
  status: BookingStatus;
  mitarbeiterIds: string[];
  equipmentIds: string[];
  prueflingId: string;
  anforderung: string;
}
