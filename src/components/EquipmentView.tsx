import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Equipment } from '../types';

const statusInfo: Record<Equipment['status'], { label: string; color: string }> = {
  verfuegbar: { label: 'Verfügbar', color: 'text-green-400' },
  im_einsatz: { label: 'Im Einsatz', color: 'text-yellow-400' },
  wartung: { label: 'Wartung', color: 'text-orange-400' },
  defekt: { label: 'Defekt', color: 'text-red-400' },
};

export default function EquipmentView() {
  const { state, dispatch } = useApp();
  const [editEQ, setEditEQ] = useState<Equipment | null>(null);
  const [showForm, setShowForm] = useState(false);
  const emptyEQ: Omit<Equipment, 'id'> = { name: '', typ: '', seriennummer: '', status: 'verfuegbar', naechsteWartung: '', beschreibung: '' };
  const [form, setForm] = useState<Omit<Equipment, 'id'>>(emptyEQ);

  function openEdit(eq: Equipment) { setEditEQ(eq); setForm({ ...eq }); setShowForm(true); }
  function openNew() { setEditEQ(null); setForm(emptyEQ); setShowForm(true); }
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editEQ) dispatch({ type: 'UPDATE_EQUIPMENT', payload: { ...form, id: editEQ.id } });
    else dispatch({ type: 'ADD_EQUIPMENT', payload: { ...form, id: 'eq' + Date.now() } });
    setShowForm(false);
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Equipment ({state.equipment.length})</h2>
        <button onClick={openNew} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium">+ Neues Equipment</button>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm text-left">
          <thead className="sticky top-0 bg-gray-800 text-gray-400 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Typ</th>
              <th className="px-4 py-3 font-medium">Seriennummer</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Nächste Wartung</th>
            </tr>
          </thead>
          <tbody>
            {state.equipment.map((eq, i) => {
              const si = statusInfo[eq.status];
              return (
                <tr key={eq.id} onClick={() => openEdit(eq)} className={`border-b border-gray-800 hover:bg-gray-800 cursor-pointer ${i % 2 === 0 ? 'bg-gray-900' : ''}`}>
                  <td className="px-4 py-3 text-gray-200 font-medium">{eq.name}</td>
                  <td className="px-4 py-3 text-gray-400">{eq.typ}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs font-mono">{eq.seriennummer}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-medium ${si.color}`}>● {si.label}</span></td>
                  <td className="px-4 py-3 text-gray-400">{eq.naechsteWartung}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg border border-gray-700">
            <div className="flex items-center justify-between p-5 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">{editEQ ? 'Equipment bearbeiten' : 'Neues Equipment'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Typ</label>
                  <input name="typ" value={form.typ} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Seriennummer</label>
                  <input name="seriennummer" value={form.seriennummer} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Status</label>
                  <select name="status" value={form.status} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                    <option value="verfuegbar">Verfügbar</option>
                    <option value="im_einsatz">Im Einsatz</option>
                    <option value="wartung">Wartung</option>
                    <option value="defekt">Defekt</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Nächste Wartung</label>
                <input type="date" name="naechsteWartung" value={form.naechsteWartung} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Beschreibung</label>
                <textarea name="beschreibung" value={form.beschreibung} onChange={handleChange} rows={2} className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg font-medium">Abbrechen</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium">{editEQ ? 'Speichern' : 'Erstellen'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
