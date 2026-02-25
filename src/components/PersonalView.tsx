import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mitarbeiter } from '../types';

const verfuegbarInfo: Record<Mitarbeiter['verfuegbarkeit'], { label: string; color: string }> = {
  verfuegbar: { label: 'Verfügbar', color: 'text-green-400' },
  im_einsatz: { label: 'Im Einsatz', color: 'text-yellow-400' },
  urlaub: { label: 'Urlaub', color: 'text-blue-400' },
  krank: { label: 'Krank', color: 'text-red-400' },
};

export default function PersonalView() {
  const { state, dispatch } = useApp();
  const [editMA, setEditMA] = useState<Mitarbeiter | null>(null);
  const [showForm, setShowForm] = useState(false);
  const emptyMA: Omit<Mitarbeiter, 'id'> = { name: '', rolle: '', email: '', qualifikationen: [], verfuegbarkeit: 'verfuegbar' };
  const [form, setForm] = useState<Omit<Mitarbeiter, 'id'>>(emptyMA);
  const [qualInput, setQualInput] = useState('');

  function openEdit(ma: Mitarbeiter) { setEditMA(ma); setForm({ ...ma }); setQualInput(ma.qualifikationen.join(', ')); setShowForm(true); }
  function openNew() { setEditMA(null); setForm(emptyMA); setQualInput(''); setShowForm(true); }
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const quals = qualInput.split(',').map(q => q.trim()).filter(Boolean);
    const data = { ...form, qualifikationen: quals };
    if (editMA) dispatch({ type: 'UPDATE_MITARBEITER', payload: { ...data, id: editMA.id } });
    else dispatch({ type: 'ADD_MITARBEITER', payload: { ...data, id: 'ma' + Date.now() } });
    setShowForm(false);
  }

  const allQuals = Array.from(new Set(state.mitarbeiter.flatMap(m => m.qualifikationen)));

  return (
    <div className="flex flex-col h-full bg-gray-900 p-6 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Personal ({state.mitarbeiter.length})</h2>
        <button onClick={openNew} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium">+ Neuer Mitarbeiter</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {state.mitarbeiter.map(ma => {
          const vi = verfuegbarInfo[ma.verfuegbarkeit];
          return (
            <div key={ma.id} onClick={() => openEdit(ma)}
              className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-blue-500 cursor-pointer transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  {ma.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{ma.name}</p>
                  <p className="text-xs text-gray-400">{ma.rolle}</p>
                </div>
              </div>
              <p className={`text-xs font-medium mb-2 ${vi.color}`}>● {vi.label}</p>
              <div className="flex flex-wrap gap-1">
                {ma.qualifikationen.map(q => (
                  <span key={q} className="text-xs bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded">{q}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <h3 className="text-sm font-semibold text-gray-300 mb-3">Kompetenzmatrix</h3>
      <div className="overflow-x-auto rounded-xl border border-gray-700">
        <table className="text-xs text-left">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-gray-400 font-medium sticky left-0 bg-gray-800">Mitarbeiter</th>
              {allQuals.map(q => (
                <th key={q} className="px-3 py-2 text-gray-400 font-medium whitespace-nowrap">{q}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {state.mitarbeiter.map((ma, i) => (
              <tr key={ma.id} className={`border-t border-gray-700 ${i % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'}`}>
                <td className="px-4 py-2 text-gray-300 font-medium sticky left-0 bg-inherit">{ma.name}</td>
                {allQuals.map(q => (
                  <td key={q} className="px-3 py-2 text-center">
                    {ma.qualifikationen.includes(q) ? <span className="text-green-400">✓</span> : <span className="text-gray-700">—</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg border border-gray-700">
            <div className="flex items-center justify-between p-5 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">{editMA ? 'Mitarbeiter bearbeiten' : 'Neuer Mitarbeiter'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Rolle</label>
                  <input name="rolle" value={form.rolle} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">E-Mail</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Verfügbarkeit</label>
                <select name="verfuegbarkeit" value={form.verfuegbarkeit} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                  <option value="verfuegbar">Verfügbar</option>
                  <option value="im_einsatz">Im Einsatz</option>
                  <option value="urlaub">Urlaub</option>
                  <option value="krank">Krank</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Qualifikationen (kommagetrennt)</label>
                <input value={qualInput} onChange={e => setQualInput(e.target.value)} placeholder="z.B. Motorentest, Klimatest" className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg font-medium">Abbrechen</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium">{editMA ? 'Speichern' : 'Erstellen'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
