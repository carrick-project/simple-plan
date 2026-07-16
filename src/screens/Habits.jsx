import React, { useState } from 'react';
import { usePlanner, DAYS, todayDayIndex, streakFor } from '../state/PlannerContext';
import AddRow from '../components/AddRow';

export default function Habits() {
  const { habits, toggleHabitDay, addHabit } = usePlanner();
  const todayIdx = todayDayIndex();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');

  function submit(e) {
    e.preventDefault();
    addHabit({ name });
    setName('');
    setAdding(false);
  }

  return (
    <>
      <header className="app-header">
        <h1>Habits</h1>
      </header>
      <main className="app-main">
        {habits.map((h) => {
          const streak = streakFor(h.log);
          return (
            <section className="section" key={h.id}>
              <div className="row" style={{ border: 'none', padding: '0 0 var(--space-2)' }}>
                <span className="row-title" style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{h.name}</span>
                <span className="row-sub">{streak}-day streak</span>
              </div>
              <div className="streak-row">
                {DAYS.map((day, i) => {
                  const isFuture = i > todayIdx;
                  return (
                    <button
                      key={day}
                      type="button"
                      className={`streak-dot${h.log[i] ? ' on' : ''}${i === todayIdx ? ' today' : ''}${isFuture ? ' future' : ''}`}
                      disabled={isFuture}
                      aria-label={`${h.name} — ${day}`}
                      aria-pressed={!!h.log[i]}
                      onClick={() => toggleHabitDay(h.id, i)}
                    />
                  );
                })}
              </div>
            </section>
          );
        })}

        {!adding && <AddRow label="New habit" onClick={() => setAdding(true)} />}

        {adding && (
          <form className="add-form" onSubmit={submit}>
            <div className="field">
              <label htmlFor="habit-name">Habit</label>
              <input
                id="habit-name"
                className="input"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Meditate"
              />
            </div>
            <div className="add-form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setAdding(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={!name.trim()}>Add habit</button>
            </div>
          </form>
        )}
      </main>
    </>
  );
}
