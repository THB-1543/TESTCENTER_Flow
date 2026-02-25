import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Pruefstand } from '../types';

const statusLabel: Record<Pruefstand['status'], { label: string; color: string }> = {
  verfuegbar: { label: 'Verfügbar', color: 'text-green-400' },
  belegt: { label: 'Belegt', color: 'text-yellow-400' },
  wartung: { label: 'Wartung', color: 'text-red-400' },
};

export default function PruefstaendeView() {
  const { state, dispatch } = useApp();
  const [editPS, setEditPS] = useState<Pruefstand | null>(null);
  const [showForm, setShowForm] = useState(false);
  const emptyPS: Omit<Pruefstand, 'id'> = { name: '', typ: '', kapazitaet: '', standort: '', status: 'verfuegbar', beschreibung: '' };
  const [form, setForm] = useState<Omit<Pruefstand, 'id'>>(emptyPS);

  function openEdit(ps: Pruefstand) {
    setEditPS(ps);
    setForm({ ...ps });
    setShowForm(true);
  }

  function openNew() {
    setEditPS(null);
    setForm(emptyPS);
    setShowForm(true);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editPS) {
      dispatch({ type: 'UPDATE_PRUEFSTAND', payload: { ...form, id: editPS.id } });
    } else {
      dispatch({ type: 'ADD_PRUEFSTAND', payload: { ...form, id: 'ps' + Date.now() } });
    }
    setShowForm(false);
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Prüfstände ({state.pruefstaende.length})</h2>
        <button onClick={openNew} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium">
          + Neuer Prüfstand
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {state.pruefstaende.map(ps => (
          <div key={ps.id} onClick={() => openEdit(ps)}
            className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-blue-500 cursor-pointer transition-colors">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">{ps.name}</h3>
              <span className={`text-xs font-medium ${statusLabel[ps.status].color}`}>● {statusLabel[ps.status].label}</span>
            </div>
            <p className="text-xs text-gray-400 mb-1">{ps.typ} · {ps.kapazitaet}</p>
            <p className="text-xs text-gray-500 mb-2">{ps.standort}</p>
            <p className="text-xs text-gray-400 line-clamp-2">{ps.beschreibung}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg border border-gray-700">
            <div className="flex items-center justify-between p-5 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">{editPS ? 'Prüfstand bearbeiten' : 'Neuer Prüfstand'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Typ *</label>
                  <input name="typ" value={form.typ} onChange={handleChange} required className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Kapazität</label>
                  <input name="kapazitaet" value={form.kapazitaet} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Standort</label>
                  <input name="standort" value={form.standort} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Status</label>
                <select name="status" value={form.status} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                  <option value="verfuegbar">Verfügbar</option>
                  <option value="belegt">Belegt</option>
                  <option value="wartung">Wartung</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Beschreibung</label>
                <textarea name="beschreibung" value={form.beschreibung} onChange={handleChange} rows={2} className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg font-medium">Abbrechen</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium">{editPS ? 'Speichern' : 'Erstellen'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
