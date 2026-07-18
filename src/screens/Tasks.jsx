import React, { useState } from 'react';
import {
  usePlanner,
  DAYS,
  todayDayIndex,
  orderedDays,
  sortByPriority,
  PRIORITIES,
  PRIORITY_LABELS,
} from '../state/PlannerContext';
import Checkbox from '../components/Checkbox';
import AddRow from '../components/AddRow';

const WEEKEND = new Set(['Sat', 'Sun']);
const dayClass = (day) => (WEEKEND.has(day) ? 'weekend' : 'weekday');

export default function Tasks() {
  const { tasks, settings, toggleTask, addTask, moveTask } = usePlanner();
  const days = orderedDays(settings.weekStart);
  const [activeDay, setActiveDay] = useState(DAYS[todayDayIndex()]);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [time, setTime] = useState('');

  const dayTasks = sortByPriority(tasks.filter((t) => t.day === activeDay));

  function submit(e) {
    e.preventDefault();
    addTask({ title, description, priority, day: activeDay, time });
    setTitle('');
    setDescription('');
    setPriority('medium');
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
              className={`day-chip ${dayClass(day)}${day === activeDay ? ' active' : ''}`}
              onClick={() => setActiveDay(day)}
            >
              {day}
            </button>
          ))}
        </div>

        {dayTasks.length === 0 && <p className="empty-state">No tasks for {activeDay}.</p>}

        <div>
          {dayTasks.map((t) => (
            <div className="row task-row" key={t.id}>
              <Checkbox checked={t.done} onClick={() => toggleTask(t.id)} label={t.title} />
              <div className="task-main">
                <div className="task-line">
                  <span className={`row-title${t.done ? ' done' : ''}`}>{t.title}</span>
                  <span className={`tag priority-${t.priority || 'medium'}`}>
                    {PRIORITY_LABELS[t.priority] || 'Medium'}
                  </span>
                  {t.delayed && (
                    <span className="tag tag-delayed">
                      delayed{t.delayedFrom ? ` from ${t.delayedFrom}` : ''}
                    </span>
                  )}
                  {t.time && <span className="tag tag-neutral">{t.time}</span>}
                </div>
                {t.description && <div className="task-desc">{t.description}</div>}
              </div>
              <select
                className="task-move"
                value=""
                aria-label={`Move ${t.title} to another day`}
                onChange={(e) => {
                  if (e.target.value) moveTask(t.id, e.target.value);
                }}
              >
                <option value="">Move…</option>
                {DAYS.filter((d) => d !== t.day).map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

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
              <label htmlFor="task-desc">Notes (optional)</label>
              <textarea
                id="task-desc"
                className="input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Any details, links, or context"
                rows={2}
              />
            </div>
            <div className="field">
              <label htmlFor="task-priority">Priority</label>
              <select id="task-priority" className="input" value={priority} onChange={(e) => setPriority(e.target.value)}>
                {PRIORITIES.map((p) => <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>)}
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
