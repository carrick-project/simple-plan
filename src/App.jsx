import React, { useState } from 'react';
import { PlannerProvider } from './state/PlannerContext';
import BottomNav from './components/BottomNav';
import Today from './screens/Today';
import Tasks from './screens/Tasks';
import Habits from './screens/Habits';
import CalendarScreen from './screens/Calendar';
import Notes from './screens/Notes';
import Settings from './screens/Settings';

const SCREENS = {
  today: Today,
  tasks: Tasks,
  habits: Habits,
  calendar: CalendarScreen,
  notes: Notes,
};

export default function App() {
  const [screen, setScreen] = useState('today');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const Screen = SCREENS[screen];

  return (
    <PlannerProvider>
      <div className="app-shell">
        {settingsOpen ? (
          <Settings onBack={() => setSettingsOpen(false)} />
        ) : (
          <Screen onOpenSettings={() => setSettingsOpen(true)} />
        )}
        {!settingsOpen && <BottomNav screen={screen} onNavigate={setScreen} />}
      </div>
    </PlannerProvider>
  );
}
