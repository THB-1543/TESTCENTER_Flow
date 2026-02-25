import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Buchung, BookingStatus } from '../types';
import { statusColors } from '../utils/colors';

interface Props {
  buchung: Buchung | null;
  onClose: () => void;
}

const emptyBuchung: Omit<Buchung, 'id'> = {
  projektId: '',
  pruefstandId: '',
  titel: '',
  startDatum: new Date().toISOString().split('T')[0],
  endDatum: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  ruestzeit: 1,
  pruefzeit: 5,
  abbauzeit: 1,
  status: 'geplant',
  mitarbeiterIds: [],
  equipmentIds: [],
  prueflingId: '',
  anforderung: '',
};

export default function BookingModal({ buchung, onClose }: Props) {
  const { state, dispatch } = useApp();
  const [form, setForm] = useState<Omit<Buchung, 'id'>>(buchung ? { ...buchung } : { ...emptyBuchung });
  const isEdit = !!buchung;

  useEffect(() => {
    if (buchung) setForm({ ...buchung });
  }, [buchung]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(f => ({ ...f, [e.target.name]: parseInt(e.target.value) || 0 }));
  }

  function toggleMulti(field: 'mitarbeiterIds' | 'equipmentIds', id: string) {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(id) ? f[field].filter(x => x !== id) : [...f[field], id],
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isEdit && buchung) {
      dispatch({ type: 'UPDATE_BUCHUNG', payload: { ...form, id: buchung.id } });
    } else {
      dispatch({ type: 'ADD_BUCHUNG', payload: { ...form, id: 'b' + Date.now() } });
    }
    onClose();
  }

  function handleDelete() {
    if (buchung) {
      dispatch({ type: 'DELETE_BUCHUNG', payload: buchung.id });
      onClose();
    }
  }

  const selectedPruefstand = state.pruefstaende.find(p => p.id === form.pruefstandId);
  const qualifyingMitarbeiter = selectedPruefstand
    ? state.mitarbeiter.filter(m => m.qualifikationen.some(q => q === selectedPruefstand.typ))
    : state.mitarbeiter;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">
            {isEdit ? 'Buchung bearbeiten' : 'Neue Buchung'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Titel *</label>
              <input name="titel" value={form.titel} onChange={handleChange} required
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                {(Object.entries(statusColors) as [BookingStatus, { bg: string; text: string; label: string }][]).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Projekt *</label>
              <select name="projektId" value={form.projektId} onChange={handleChange} required
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                <option value="">— Auswählen —</option>
                {state.projekte.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Prüfstand *</label>
              <select name="pruefstandId" value={form.pruefstandId} onChange={handleChange} required
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                <option value="">— Auswählen —</option>
                {state.pruefstaende.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Startdatum *</label>
              <input type="date" name="startDatum" value={form.startDatum} onChange={handleChange} required
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Enddatum *</label>
              <input type="date" name="endDatum" value={form.endDatum} onChange={handleChange} required
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Rüstzeit (Tage)</label>
              <input type="number" name="ruestzeit" value={form.ruestzeit} onChange={handleNumberChange} min={0}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Prüfzeit (Tage)</label>
              <input type="number" name="pruefzeit" value={form.pruefzeit} onChange={handleNumberChange} min={1}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Abbauzeit (Tage)</label>
              <input type="number" name="abbauzeit" value={form.abbauzeit} onChange={handleNumberChange} min={0}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Prüflings-ID</label>
              <input name="prueflingId" value={form.prueflingId} onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Personal (nach Qualifikation gefiltert)</label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto bg-gray-700 rounded-lg p-2 border border-gray-600">
              {qualifyingMitarbeiter.map(m => (
                <label key={m.id} className="flex items-center gap-2 cursor-pointer text-sm text-gray-300 hover:text-white p-1 rounded">
                  <input type="checkbox" checked={form.mitarbeiterIds.includes(m.id)}
                    onChange={() => toggleMulti('mitarbeiterIds', m.id)}
                    className="accent-blue-500" />
                  <span>{m.name}</span>
                  <span className={`text-xs px-1 rounded ${m.verfuegbarkeit === 'verfuegbar' ? 'text-green-400' : m.verfuegbarkeit === 'im_einsatz' ? 'text-yellow-400' : 'text-red-400'}`}>
                    ●
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Equipment</label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto bg-gray-700 rounded-lg p-2 border border-gray-600">
              {state.equipment.map(eq => (
                <label key={eq.id} className="flex items-center gap-2 cursor-pointer text-sm text-gray-300 hover:text-white p-1 rounded">
                  <input type="checkbox" checked={form.equipmentIds.includes(eq.id)}
                    onChange={() => toggleMulti('equipmentIds', eq.id)}
                    className="accent-blue-500"
                    disabled={eq.status === 'defekt'} />
                  <span className={eq.status === 'defekt' ? 'line-through text-gray-500' : ''}>{eq.name}</span>
                  <span className={`text-xs ${eq.status === 'verfuegbar' ? 'text-green-400' : eq.status === 'wartung' || eq.status === 'defekt' ? 'text-red-400' : 'text-yellow-400'}`}>●</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Anforderungsbeschreibung</label>
            <textarea name="anforderung" value={form.anforderung} onChange={handleChange} rows={3}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none" />
          </div>

          <div className="flex justify-between pt-2">
            {isEdit && (
              <button type="button" onClick={handleDelete}
                className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white text-sm rounded-lg font-medium">
                Löschen
              </button>
            )}
            <div className="flex gap-3 ml-auto">
              <button type="button" onClick={onClose}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg font-medium">
                Abbrechen
              </button>
              <button type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium">
                {isEdit ? 'Speichern' : 'Erstellen'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
