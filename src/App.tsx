import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import GanttChart from './components/GanttChart';
import BuchungenView from './components/BuchungenView';
import PruefstaendeView from './components/PruefstaendeView';
import EquipmentView from './components/EquipmentView';
import PersonalView from './components/PersonalView';

function MainContent() {
  const { state } = useApp();
  switch (state.activeView) {
    case 'gantt': return <GanttChart />;
    case 'buchungen': return <BuchungenView />;
    case 'pruefstaende': return <PruefstaendeView />;
    case 'equipment': return <EquipmentView />;
    case 'personal': return <PersonalView />;
    default: return <GanttChart />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <div className="flex h-screen bg-gray-900 text-white overflow-hidden dark">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <MainContent />
        </main>
      </div>
    </AppProvider>
  );
}
