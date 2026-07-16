import React, { useState } from 'react';
import { usePlanner, formatShortDate } from '../state/PlannerContext';
import AddRow from '../components/AddRow';

export default function Notes() {
  const { notes, addNote } = usePlanner();
  const [openId, setOpenId] = useState(null);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  function submit(e) {
    e.preventDefault();
    addNote({ title, body });
    setTitle('');
    setBody('');
    setAdding(false);
  }

  return (
    <>
      <header className="app-header">
        <h1>Notes</h1>
      </header>
      <main className="app-main">
        <p className="app-header-meta" style={{ marginBottom: 'var(--space-4)' }}>
          Ideas, things to consider, loose thoughts
        </p>

        {notes.length === 0 && <p className="empty-state">No notes yet.</p>}

        <div>
          {notes.map((n) => {
            const open = openId === n.id;
            return (
              <div className="note-card" key={n.id} onClick={() => setOpenId(open ? null : n.id)}>
                <div className="note-title">{n.title}</div>
                <div className="note-date">{formatShortDate(new Date(n.date))}</div>
                {open && n.body && <div className="note-body">{n.body}</div>}
              </div>
            );
          })}
        </div>

        {!adding && <AddRow label="Add note" onClick={() => setAdding(true)} />}

        {adding && (
          <form className="add-form" onSubmit={submit}>
            <div className="field">
              <label htmlFor="note-title">Title</label>
              <input
                id="note-title"
                className="input"
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's on your mind?"
              />
            </div>
            <div className="field">
              <label htmlFor="note-body">Notes</label>
              <textarea
                id="note-body"
                className="input"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Details, links, loose thoughts…"
              />
            </div>
            <div className="add-form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setAdding(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={!title.trim()}>Add note</button>
            </div>
          </form>
        )}
      </main>
    </>
  );
}
