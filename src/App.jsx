import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient';
import Login from './components/Login';
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
  const [session, setSession] = useState(undefined); // undefined = still checking
  const [screen, setScreen] = useState('today');
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (!isSupabaseConfigured) {
    return (
      <div className="app-shell">
        <main className="app-main" style={{ paddingTop: 48 }}>
          <p>Sync isn't set up yet — add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see .env.example).</p>
        </main>
      </div>
    );
  }

  if (session === undefined) return null;
  if (!session) return <Login />;

  const Screen = SCREENS[screen];

  return (
    <PlannerProvider userId={session.user.id}>
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
