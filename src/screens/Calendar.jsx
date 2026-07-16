import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Repeat } from 'lucide-react';
import { usePlanner, DAYS, orderedDays, formatShortDate } from '../state/PlannerContext';
import Checkbox from '../components/Checkbox';

const DOW_LETTERS = { Mon: 'M', Tue: 'T', Wed: 'W', Thu: 'T', Fri: 'F', Sat: 'S', Sun: 'S' };

function sameDate(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function CalendarScreen() {
  const { tasks, habits, settings, toggleTask } = usePlanner();
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(today);

  const dowOrder = orderedDays(settings.weekStart);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthLabel = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(viewDate);

  const cells = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const jsFirstDow = new Date(year, month, 1).getDay(); // 0=Sun..6=Sat
    const leading = settings.weekStart === 'Sunday' ? jsFirstDow : (jsFirstDow + 6) % 7;
    const out = [];
    for (let i = 0; i < leading; i++) out.push(null);
    for (let d = 1; d <= daysInMonth; d++) out.push(new Date(year, month, d));
    return out;
  }, [year, month, settings.weekStart]);

  const selectedWeekday = DAYS[(selected.getDay() + 6) % 7];
  const agendaTasks = tasks.filter((t) => t.day === selectedWeekday);

  return (
    <>
      <header className="app-header">
        <h1>Calendar</h1>
      </header>
      <main className="app-main">
        <div className="cal-header">
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 18 }}>{monthLabel}</span>
          <div style={{ display: 'flex', gap: 4 }}>
            <button type="button" className="icon-btn" aria-label="Previous month" onClick={() => setViewDate(new Date(year, month - 1, 1))}>
              <ChevronLeft size={16} />
            </button>
            <button type="button" className="icon-btn" aria-label="Next month" onClick={() => setViewDate(new Date(year, month + 1, 1))}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="cal-grid">
          {dowOrder.map((d) => <div className="cal-dow" key={d}>{DOW_LETTERS[d]}</div>)}
          {cells.map((date, i) => {
            if (!date) return <div className="cal-cell empty" key={`b${i}`} />;
            const isToday = sameDate(date, today);
            const isSelected = sameDate(date, selected);
            const weekday = DAYS[(date.getDay() + 6) % 7];
            const hasTasks = tasks.some((t) => t.day === weekday);
            return (
              <button
                key={date.toISOString()}
                type="button"
                className={`cal-cell${isToday ? ' today' : ''}${isSelected ? ' selected' : ''}`}
                onClick={() => setSelected(date)}
              >
                {date.getDate()}
                {hasTasks && <span className="dot" />}
              </button>
            );
          })}
        </div>

        <section className="section">
          <h2 className="section-label">{formatShortDate(selected)} — agenda</h2>
          {agendaTasks.length === 0 && <p className="empty-state">Nothing scheduled.</p>}
          <div>
            {agendaTasks.map((t) => (
              <div className="row" key={t.id}>
                <Checkbox checked={t.done} onClick={() => toggleTask(t.id)} label={t.title} />
                <span className={`row-title${t.done ? ' done' : ''}`}>{t.title}</span>
                {t.time && <span className="tag tag-neutral">{t.time}</span>}
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2 className="section-label">Daily habits</h2>
          <div className="chip-row">
            {habits.map((h) => (
              <span className="tag tag-outline" key={h.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Repeat size={11} /> {h.name}
              </span>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
