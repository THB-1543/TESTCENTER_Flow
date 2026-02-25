import { useApp } from '../context/AppContext';

const navItems = [
  { id: 'gantt' as const, label: 'Belegungsplan', icon: '📅' },
  { id: 'buchungen' as const, label: 'Buchungen', icon: '📋' },
  { id: 'pruefstaende' as const, label: 'Prüfstände', icon: '🔬' },
  { id: 'equipment' as const, label: 'Equipment', icon: '🔧' },
  { id: 'personal' as const, label: 'Personal', icon: '👥' },
];

export default function Sidebar() {
  const { state, dispatch } = useApp();
  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col h-full">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">TESTCENTER</h1>
        <p className="text-xs text-gray-400 mt-1">Prüfstand-Planungstool</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => dispatch({ type: 'SET_VIEW', payload: item.id })}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              state.activeView === item.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700 text-xs text-gray-500">
        <p>Phase 1 – v0.1.0</p>
        <p>© 2026 TESTCENTER</p>
      </div>
    </aside>
  );
}
