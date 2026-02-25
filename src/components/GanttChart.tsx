import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { statusColors } from '../utils/colors';
import { Buchung } from '../types';
import BookingModal from './BookingModal';

function getDateRange(days: number): Date[] {
  const dates: Date[] = [];
  const start = new Date('2026-02-25');
  start.setDate(start.getDate() - 10);
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(d);
  }
  return dates;
}

const CELL_WIDTH = 40;
const ROW_HEIGHT = 48;
const LABEL_WIDTH = 200;
const DAYS = 35;

export default function GanttChart() {
  const { state, dispatch } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBuchung, setSelectedBuchung] = useState<Buchung | null>(null);
  const dates = getDateRange(DAYS);

  const today = new Date('2026-02-25');
  const startDate = dates[0];

  function dayOffset(dateStr: string) {
    const d = new Date(dateStr);
    return Math.floor((d.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  function isToday(d: Date) {
    return d.toDateString() === today.toDateString();
  }

  function isWeekend(d: Date) {
    return d.getDay() === 0 || d.getDay() === 6;
  }

  const weekdays = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

  function handleBlockClick(buchung: Buchung) {
    setSelectedBuchung(buchung);
    setModalOpen(true);
  }

  function handleNewBuchung() {
    setSelectedBuchung(null);
    setModalOpen(true);
  }

  const dragRef = useRef<{ buchungId: string; startX: number; originalStart: string; originalEnd: string } | null>(null);

  function handleDragStart(e: React.MouseEvent, buchung: Buchung) {
    e.preventDefault();
    dragRef.current = {
      buchungId: buchung.id,
      startX: e.clientX,
      originalStart: buchung.startDatum,
      originalEnd: buchung.endDatum,
    };
    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
  }

  function handleDragMove(e: MouseEvent) {
    if (!dragRef.current) return;
    const delta = Math.round((e.clientX - dragRef.current.startX) / CELL_WIDTH);
    const buchung = state.buchungen.find(b => b.id === dragRef.current!.buchungId);
    if (!buchung) return;
    const startMs = new Date(dragRef.current.originalStart).getTime() + delta * 86400000;
    const endMs = new Date(dragRef.current.originalEnd).getTime() + delta * 86400000;
    const fmtDate = (ms: number) => new Date(ms).toISOString().split('T')[0];
    dispatch({ type: 'UPDATE_BUCHUNG', payload: { ...buchung, startDatum: fmtDate(startMs), endDatum: fmtDate(endMs) } });
  }

  function handleDragEnd() {
    dragRef.current = null;
    window.removeEventListener('mousemove', handleDragMove);
    window.removeEventListener('mouseup', handleDragEnd);
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">Belegungsplan</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-xs">
            {Object.entries(statusColors).map(([key, val]) => (
              <span key={key} className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm inline-block" style={{ background: val.bg }} />
                <span className="text-gray-400">{val.label}</span>
              </span>
            ))}
          </div>
          <button
            onClick={handleNewBuchung}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium"
          >
            + Neue Buchung
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex overflow-hidden">
          <div style={{ width: LABEL_WIDTH, minWidth: LABEL_WIDTH }} className="bg-gray-800 border-b border-r border-gray-700 flex items-end px-3 py-1">
            <span className="text-xs text-gray-400 font-medium">Prüfstand</span>
          </div>
          <div className="flex-1 overflow-x-auto gantt-scroll">
            <div style={{ width: DAYS * CELL_WIDTH }}>
              <div className="flex bg-gray-800 border-b border-gray-700" style={{ height: 24 }}>
                {dates.map((d, i) => {
                  const showMonth = i === 0 || d.getDate() === 1;
                  return (
                    <div key={i} style={{ width: CELL_WIDTH, minWidth: CELL_WIDTH }}
                      className={`border-r border-gray-700 flex items-center justify-center text-xs text-gray-400 ${showMonth ? 'font-semibold' : ''}`}>
                      {showMonth ? months[d.getMonth()] : ''}
                    </div>
                  );
                })}
              </div>
              <div className="flex bg-gray-800 border-b border-gray-700" style={{ height: 24 }}>
                {dates.map((d, i) => (
                  <div key={i} style={{ width: CELL_WIDTH, minWidth: CELL_WIDTH }}
                    className={`border-r border-gray-700 flex flex-col items-center justify-center text-xs
                      ${isToday(d) ? 'bg-blue-900 text-blue-300 font-bold' : isWeekend(d) ? 'text-gray-600' : 'text-gray-400'}`}>
                    <span>{weekdays[d.getDay()]}</span>
                    <span>{d.getDate()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex">
          <div style={{ width: LABEL_WIDTH, minWidth: LABEL_WIDTH }} className="overflow-y-auto border-r border-gray-700">
            {state.pruefstaende.map((ps) => (
              <div key={ps.id} style={{ height: ROW_HEIGHT }}
                className="flex flex-col justify-center px-3 border-b border-gray-700 bg-gray-800">
                <span className="text-sm font-medium text-gray-200 truncate">{ps.name}</span>
                <span className="text-xs text-gray-500">{ps.typ}</span>
              </div>
            ))}
          </div>

          <div className="flex-1 overflow-auto gantt-scroll">
            <div style={{ width: DAYS * CELL_WIDTH, position: 'relative' }}>
              {state.pruefstaende.map((ps, rowIdx) => {
                const rowBuchungen = state.buchungen.filter(b => b.pruefstandId === ps.id);
                return (
                  <div key={ps.id} style={{ height: ROW_HEIGHT, position: 'relative' }}
                    className="border-b border-gray-700">
                    <div className="flex h-full">
                      {dates.map((d, i) => (
                        <div key={i} style={{ width: CELL_WIDTH, minWidth: CELL_WIDTH }}
                          className={`border-r border-gray-700/50 h-full ${
                            isToday(d) ? 'bg-blue-900/20' : isWeekend(d) ? 'bg-gray-800/60' : rowIdx % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/30'
                          }`} />
                      ))}
                    </div>
                    {rowBuchungen.map(b => {
                      const left = dayOffset(b.startDatum) * CELL_WIDTH;
                      const endOff = dayOffset(b.endDatum);
                      const startOff = dayOffset(b.startDatum);
                      const width = Math.max((endOff - startOff + 1) * CELL_WIDTH - 2, CELL_WIDTH - 2);
                      const color = statusColors[b.status];
                      if (left < 0 && left + width < 0) return null;
                      return (
                        <div
                          key={b.id}
                          style={{
                            position: 'absolute',
                            left: Math.max(left, 0),
                            top: 6,
                            width: left < 0 ? width + left : width,
                            height: ROW_HEIGHT - 12,
                            background: color.bg,
                            color: color.text,
                            borderRadius: 4,
                            cursor: 'grab',
                            userSelect: 'none',
                            zIndex: 10,
                            overflow: 'hidden',
                          }}
                          onClick={() => handleBlockClick(b)}
                          onMouseDown={(e) => handleDragStart(e, b)}
                          title={b.titel}
                        >
                          <div className="px-2 py-1 text-xs font-medium truncate leading-tight">
                            {b.titel}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <BookingModal
          buchung={selectedBuchung}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
