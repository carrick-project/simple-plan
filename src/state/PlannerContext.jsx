import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const DEFAULT_SETTINGS = { name: 'You', theme: 'light', weekStart: 'Monday', reminders: true };

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const DAY_LABELS = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday' };

export function todayDayIndex() {
  return (new Date().getDay() + 6) % 7; // 0 = Mon ... 6 = Sun
}

function dayFromToday(offset) {
  return DAYS[(todayDayIndex() + offset + 7) % 7];
}

function dateOffset(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

export function formatShortDate(date) {
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(date);
}

export function formatLongDate(date) {
  return new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).format(date);
}

function seedTasks() {
  return [
    { id: 'task-1', title: 'Send Q3 report', category: 'Work', day: dayFromToday(0), time: '2:00 PM', done: false },
    { id: 'task-2', title: 'Team standup', category: 'Work', day: dayFromToday(0), time: null, done: true },
    { id: 'task-3', title: 'Book dentist', category: 'Personal', day: dayFromToday(1), time: null, done: false },
    { id: 'task-4', title: 'Grocery run', category: 'Personal', day: dayFromToday(2), time: '6:00 PM', done: false },
    { id: 'task-5', title: 'Pay rent', category: 'Errands', day: dayFromToday(-1), time: null, done: true },
  ];
}

function seedHabits() {
  const todayIdx = todayDayIndex();
  const upToToday = (n) => DAYS.map((_, i) => i <= todayIdx && i > todayIdx - n);
  return [
    { id: 'habit-1', name: 'Water', log: upToToday(6) },
    { id: 'habit-2', name: 'Read', log: upToToday(2) },
    { id: 'habit-3', name: 'Gym', log: DAYS.map(() => false) },
  ];
}

function seedNotes() {
  return [
    { id: 'note-1', title: 'Side project name ideas', body: 'Dayspring, Loopwork, Nudge, Backburner. Ask Sam which one sounds least like a startup.', date: dateOffset(-3).toISOString() },
    { id: 'note-2', title: 'Book recs from Sam', body: 'Deep Work, Four Thousand Weeks, The Almanack of Naval Ravikant.', date: dateOffset(-5).toISOString() },
    { id: 'note-3', title: 'Maybe try a new gym schedule', body: 'Mornings before work instead of evenings — see if it sticks better for a couple weeks.', date: dateOffset(-7).toISOString() },
  ];
}

const TOP_GOAL = { label: 'Launch side project', progress: 0.8 };

const PlannerContext = createContext(null);

export function PlannerProvider({ userId, children }) {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [notes, setNotes] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const hydrated = useRef(false);

  // Load this user's planner row on sign-in; seed one if they're new.
  useEffect(() => {
    let cancelled = false;
    hydrated.current = false;
    setLoading(true);

    async function load() {
      const { data, error } = await supabase
        .from('planner_state')
        .select('tasks, habits, notes, settings')
        .eq('user_id', userId)
        .maybeSingle();

      if (cancelled) return;

      if (!error && data) {
        setTasks(data.tasks);
        setHabits(data.habits);
        setNotes(data.notes);
        setSettings(data.settings);
      } else {
        const seeded = { tasks: seedTasks(), habits: seedHabits(), notes: seedNotes(), settings: DEFAULT_SETTINGS };
        await supabase.from('planner_state').insert({ user_id: userId, ...seeded });
        setTasks(seeded.tasks);
        setHabits(seeded.habits);
        setNotes(seeded.notes);
        setSettings(seeded.settings);
      }
      hydrated.current = true;
      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [userId]);

  // Push any change back up, a moment after it happens.
  useEffect(() => {
    if (!hydrated.current) return;
    const timeout = setTimeout(() => {
      supabase
        .from('planner_state')
        .upsert({ user_id: userId, tasks, habits, notes, settings, updated_at: new Date().toISOString() })
        .then(({ error }) => {
          if (error) console.error('Sync failed:', error.message);
        });
    }, 500);
    return () => clearTimeout(timeout);
  }, [tasks, habits, notes, settings, userId]);

  const value = useMemo(() => {
    function toggleHabitDay(habitId, dayIdx) {
      if (dayIdx > todayDayIndex()) return;
      setHabits((prev) => prev.map((h) => {
        if (h.id !== habitId) return h;
        const log = [...h.log];
        log[dayIdx] = !log[dayIdx];
        return { ...h, log };
      }));
    }

    return {
      tasks,
      habits,
      notes,
      settings,
      topGoal: TOP_GOAL,

      toggleTask(id) {
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
      },
      addTask({ title, category, day, time }) {
        if (!title.trim()) return;
        setTasks((prev) => [
          ...prev,
          { id: `task-${Date.now()}`, title: title.trim(), category: category || 'Personal', day, time: time || null, done: false },
        ]);
      },

      toggleHabitDay,
      toggleHabitToday(habitId) {
        toggleHabitDay(habitId, todayDayIndex());
      },
      addHabit({ name }) {
        if (!name.trim()) return;
        setHabits((prev) => [...prev, { id: `habit-${Date.now()}`, name: name.trim(), log: DAYS.map(() => false) }]);
      },

      addNote({ title, body }) {
        if (!title.trim()) return;
        setNotes((prev) => [
          { id: `note-${Date.now()}`, title: title.trim(), body: body.trim(), date: new Date().toISOString() },
          ...prev,
        ]);
      },

      updateSettings(patch) {
        setSettings((prev) => ({ ...prev, ...patch }));
      },
    };
  }, [tasks, habits, notes, settings]);

  if (loading) {
    return (
      <div className="app-shell">
        <main className="app-main" style={{ paddingTop: 48 }}>
          <p>Loading your planner…</p>
        </main>
      </div>
    );
  }

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}

export function usePlanner() {
  const ctx = useContext(PlannerContext);
  if (!ctx) throw new Error('usePlanner must be used within PlannerProvider');
  return ctx;
}

export function streakFor(log) {
  const todayIdx = todayDayIndex();
  let count = 0;
  for (let i = todayIdx; i >= 0; i--) {
    if (log[i]) count++;
    else break;
  }
  return count;
}

export function orderedDays(weekStart) {
  if (weekStart === 'Sunday') return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return DAYS;
}
