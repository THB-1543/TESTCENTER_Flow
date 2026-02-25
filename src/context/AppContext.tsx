import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Pruefstand, Equipment, Mitarbeiter, Projekt, Buchung } from '../types';
import { initialPruefstaende, initialEquipment, initialMitarbeiter, initialProjekte, initialBuchungen } from '../data/mockData';

interface AppState {
  pruefstaende: Pruefstand[];
  equipment: Equipment[];
  mitarbeiter: Mitarbeiter[];
  projekte: Projekt[];
  buchungen: Buchung[];
  activeView: 'gantt' | 'buchungen' | 'pruefstaende' | 'equipment' | 'personal';
}

type Action =
  | { type: 'SET_VIEW'; payload: AppState['activeView'] }
  | { type: 'ADD_BUCHUNG'; payload: Buchung }
  | { type: 'UPDATE_BUCHUNG'; payload: Buchung }
  | { type: 'DELETE_BUCHUNG'; payload: string }
  | { type: 'ADD_PRUEFSTAND'; payload: Pruefstand }
  | { type: 'UPDATE_PRUEFSTAND'; payload: Pruefstand }
  | { type: 'ADD_EQUIPMENT'; payload: Equipment }
  | { type: 'UPDATE_EQUIPMENT'; payload: Equipment }
  | { type: 'ADD_MITARBEITER'; payload: Mitarbeiter }
  | { type: 'UPDATE_MITARBEITER'; payload: Mitarbeiter }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> };

const STORAGE_KEY = 'testcenter_flow_state';

function loadFromStorage(): Partial<AppState> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {};
}

function saveToStorage(state: AppState) {
  try {
    const { activeView: _activeView, ...dataToSave } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch {}
}

const initialState: AppState = {
  pruefstaende: initialPruefstaende,
  equipment: initialEquipment,
  mitarbeiter: initialMitarbeiter,
  projekte: initialProjekte,
  buchungen: initialBuchungen,
  activeView: 'gantt',
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, activeView: action.payload };
    case 'ADD_BUCHUNG':
      return { ...state, buchungen: [...state.buchungen, action.payload] };
    case 'UPDATE_BUCHUNG':
      return { ...state, buchungen: state.buchungen.map(b => b.id === action.payload.id ? action.payload : b) };
    case 'DELETE_BUCHUNG':
      return { ...state, buchungen: state.buchungen.filter(b => b.id !== action.payload) };
    case 'ADD_PRUEFSTAND':
      return { ...state, pruefstaende: [...state.pruefstaende, action.payload] };
    case 'UPDATE_PRUEFSTAND':
      return { ...state, pruefstaende: state.pruefstaende.map(p => p.id === action.payload.id ? action.payload : p) };
    case 'ADD_EQUIPMENT':
      return { ...state, equipment: [...state.equipment, action.payload] };
    case 'UPDATE_EQUIPMENT':
      return { ...state, equipment: state.equipment.map(e => e.id === action.payload.id ? action.payload : e) };
    case 'ADD_MITARBEITER':
      return { ...state, mitarbeiter: [...state.mitarbeiter, action.payload] };
    case 'UPDATE_MITARBEITER':
      return { ...state, mitarbeiter: state.mitarbeiter.map(m => m.id === action.payload.id ? action.payload : m) };
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    const saved = loadFromStorage();
    return { ...init, ...saved };
  });

  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
