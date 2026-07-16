import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { usePlanner, DAYS, todayDayIndex, formatLongDate } from '../state/PlannerContext';
import Checkbox from '../components/Checkbox';

export default function Today({ onOpenSettings }) {
  const { tasks, habits, topGoal, toggleTask, toggleHabitToday } = usePlanner();
  const todayIdx = todayDayIndex();
  const todayName = DAYS[todayIdx];

  const todaysTasks = tasks.filter((t) => t.day === todayName);
  const tasksLeft = todaysTasks.filter((t) => !t.done).length;
  const habitsLeft = habits.filter((h) => !h.log[todayIdx]).length;

  return (
    <>
      <header className="app-header">
        <div>
          <h1>{formatLongDate(new Date())}</h1>
          <div className="app-header-meta">
            {tasksLeft} task{tasksLeft === 1 ? '' : 's'} · {habitsLeft} habit{habitsLeft === 1 ? '' : 's'} left
          </div>
        </div>
        <button type="button" className="icon-btn" aria-label="Settings" onClick={onOpenSettings}>
          <SettingsIcon size={18} />
        </button>
      </header>

      <main className="app-main">
        <section className="section">
          <h2 className="section-label">Habits</h2>
          <div className="habit-strip">
            {habits.map((h) => (
              <div className="habit-strip-item" key={h.id}>
                <Checkbox checked={!!h.log[todayIdx]} onClick={() => toggleHabitToday(h.id)} label={h.name} />
                <span>{h.name}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2 className="section-label">Tasks</h2>
          {todaysTasks.length === 0 && <p className="empty-state">Nothing on today — enjoy it.</p>}
          <div>
            {todaysTasks.map((t) => (
              <div className="row" key={t.id}>
                <Checkbox checked={t.done} onClick={() => toggleTask(t.id)} label={t.title} />
                <span className={`row-title${t.done ? ' done' : ''}`}>{t.title}</span>
                {t.time && <span className="tag tag-neutral">{t.time}</span>}
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2 className="section-label">Top goal</h2>
          <div className="goal-track">
            <div className="goal-fill" style={{ width: `${Math.round(topGoal.progress * 100)}%` }} />
          </div>
          <div className="row-title">{topGoal.label}</div>
        </section>
      </main>
    </>
  );
}
