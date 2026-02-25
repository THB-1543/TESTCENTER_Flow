import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { statusColors } from '../utils/colors';
import { Buchung } from '../types';
import BookingModal from './BookingModal';

export default function BuchungenView() {
  const { state } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBuchung, setSelectedBuchung] = useState<Buchung | null>(null);

  function handleEdit(b: Buchung) {
    setSelectedBuchung(b);
    setModalOpen(true);
  }

  function handleNew() {
    setSelectedBuchung(null);
    setModalOpen(true);
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Buchungen ({state.buchungen.length})</h2>
        <button onClick={handleNew} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium">
          + Neue Buchung
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm text-left">
          <thead className="sticky top-0 bg-gray-800 text-gray-400 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Titel</th>
              <th className="px-4 py-3 font-medium">Prüfstand</th>
              <th className="px-4 py-3 font-medium">Projekt</th>
              <th className="px-4 py-3 font-medium">Zeitraum</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Prüfling</th>
            </tr>
          </thead>
          <tbody>
            {state.buchungen.map((b, i) => {
              const ps = state.pruefstaende.find(p => p.id === b.pruefstandId);
              const proj = state.projekte.find(p => p.id === b.projektId);
              const color = statusColors[b.status];
              return (
                <tr key={b.id} onClick={() => handleEdit(b)}
                  className={`border-b border-gray-800 hover:bg-gray-800 cursor-pointer ${i % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'}`}>
                  <td className="px-4 py-3 text-gray-200 font-medium">{b.titel}</td>
                  <td className="px-4 py-3 text-gray-400">{ps?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-400">{proj?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-400">{b.startDatum} – {b.endDatum}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ background: color.bg, color: color.text }}>
                      {color.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{b.prueflingId}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {modalOpen && <BookingModal buchung={selectedBuchung} onClose={() => setModalOpen(false)} />}
    </div>
  );
}
