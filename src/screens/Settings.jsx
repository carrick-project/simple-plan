import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { usePlanner } from '../state/PlannerContext';
import { supabase } from '../lib/supabaseClient';

export default function Settings({ onBack }) {
  const { settings, updateSettings, tasks, habits, notes } = usePlanner();
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(settings.name);

  function saveName() {
    updateSettings({ name: nameDraft.trim() || settings.name });
    setEditingName(false);
  }

  function cycleTheme() {
    updateSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' });
  }

  function cycleWeekStart() {
    updateSettings({ weekStart: settings.weekStart === 'Monday' ? 'Sunday' : 'Monday' });
  }

  function exportData() {
    const payload = JSON.stringify({ tasks, habits, notes, settings }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'planner-export.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <header className="app-header">
        <button type="button" className="icon-btn" aria-label="Back" onClick={onBack}>
          <ChevronLeft size={18} />
        </button>
        <h1 style={{ marginRight: 'auto' }}>Settings</h1>
        <span style={{ width: 36 }} />
      </header>
      <main className="app-main">
        <div className="settings-row">
          <span>Name</span>
          {editingName ? (
            <input
              className="input"
              style={{ width: 140 }}
              autoFocus
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onBlur={saveName}
              onKeyDown={(e) => e.key === 'Enter' && saveName()}
            />
          ) : (
            <button type="button" className="btn btn-ghost" onClick={() => setEditingName(true)}>
              {settings.name} <ChevronRight size={14} />
            </button>
          )}
        </div>

        <div className="settings-row">
          <span>Theme</span>
          <button type="button" className="btn btn-ghost" onClick={cycleTheme}>
            {settings.theme === 'light' ? 'Light' : 'Dark'} <ChevronRight size={14} />
          </button>
        </div>

        <div className="settings-row">
          <span>Week starts on</span>
          <button type="button" className="btn btn-ghost" onClick={cycleWeekStart}>
            {settings.weekStart} <ChevronRight size={14} />
          </button>
        </div>

        <div className="settings-row">
          <span>Reminders</span>
          <button
            type="button"
            className={`switch${settings.reminders ? ' on' : ''}`}
            role="switch"
            aria-checked={settings.reminders}
            aria-label="Reminders"
            onClick={() => updateSettings({ reminders: !settings.reminders })}
          />
        </div>

        <div className="settings-row">
          <span>Export data</span>
          <button type="button" className="btn btn-ghost" onClick={exportData}>
            <Download size={14} />
          </button>
        </div>

        <div className="settings-row">
          <span>Account</span>
          <button type="button" className="btn btn-ghost" onClick={() => supabase.auth.signOut()}>
            Sign out
          </button>
        </div>
      </main>
    </>
  );
}
