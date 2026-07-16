import React from 'react';
import { Sun, ListChecks, Repeat, Calendar, NotebookPen } from 'lucide-react';

const ITEMS = [
  { key: 'today', label: 'Today', icon: Sun },
  { key: 'tasks', label: 'Tasks', icon: ListChecks },
  { key: 'habits', label: 'Habits', icon: Repeat },
  { key: 'calendar', label: 'Calendar', icon: Calendar },
  { key: 'notes', label: 'Notes', icon: NotebookPen },
];

export default function BottomNav({ screen, onNavigate }) {
  return (
    <nav className="bottom-nav">
      {ITEMS.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          type="button"
          className="nav-btn"
          aria-current={screen === key ? 'page' : undefined}
          onClick={() => onNavigate(key)}
        >
          <Icon size={20} strokeWidth={2} />
          {label}
        </button>
      ))}
    </nav>
  );
}
