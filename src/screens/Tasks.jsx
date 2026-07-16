import React, { useMemo, useState } from 'react';
import { usePlanner, DAYS, todayDayIndex, orderedDays } from '../state/PlannerContext';
import Checkbox from '../components/Checkbox';
import AddRow from '../components/AddRow';

const CATEGORIES = ['Work', 'Personal', 'Errands'];

export default function Tasks() {
  const { tasks, settings, toggleTask, addTask } = usePlanner();
  const days = orderedDays(settings.weekStart);
  const [activeDay, setActiveDay] = useState(DAYS[todayDayIndex()]);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [time, setTime] = useState('');

  const dayTasks = tasks.filter((t) => t.day === activeDay);
  const grouped = useMemo(() => {
    const byCategory = new Map();
    for (const t of dayTasks) {
      if (!byCategory.has(t.category)) byCategory.set(t.category, []);
      byCategory.get(t.category).push(t);
    }
    return byCategory;
  }, [dayTasks]);

  function submit(e) {
    e.preventDefault();
    addTask({ title, category, day: activeDay, time });
    setTitle('');
    setTime('');
    setAdding(false);
  }

  return (
    <>
      <header className="app-header">
        <h1>Tasks</h1>
      </header>
      <main className="app-main">
        <div className="day-chip-row" style={{ marginBottom: 'var(--space-4)' }}>
          {days.map((day) => (
            <button
              key={day}
              type="button"
              className={`day-chip${day === activeDay ? ' active' : ''}`}
              onClick={() => setActiveDay(day)}
            >
              {day}
            </button>
          ))}
        </div>

        {grouped.size === 0 && <p className="empty-state">No tasks for {activeDay}.</p>}

        {[...grouped.entries()].map(([cat, catTasks]) => (
          <section className="section" key={cat}>
            <h2 className="section-label">{cat}</h2>
            <div>
              {catTasks.map((t) => (
                <div className="row" key={t.id}>
                  <Checkbox checked={t.done} onClick={() => toggleTask(t.id)} label={t.title} />
                  <span className={`row-title${t.done ? ' done' : ''}`}>{t.title}</span>
                  {t.time && <span className="tag tag-neutral">{t.time}</span>}
                </div>
              ))}
            </div>
          </section>
        ))}

        {!adding && <AddRow label="Add task" onClick={() => setAdding(true)} />}

        {adding && (
          <form className="add-form" onSubmit={submit}>
            <div className="field">
              <label htmlFor="task-title">Task</label>
              <input
                id="task-title"
                className="input"
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`What needs doing on ${activeDay}?`}
              />
            </div>
            <div className="field">
              <label htmlFor="task-category">Category</label>
              <select id="task-category" className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="task-time">Time (optional)</label>
              <input
                id="task-time"
                className="input"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 2:00 PM"
              />
            </div>
            <div className="add-form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setAdding(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={!title.trim()}>Add task</button>
            </div>
          </form>
        )}
      </main>
    </>
  );
}
