import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    setSubmitting(false);
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <div className="app-shell">
      <main className="app-main" style={{ paddingTop: 48 }}>
        <h1 style={{ marginBottom: 8 }}>Simple Plan</h1>
        {sent ? (
          <p>Check <strong>{email}</strong> for a sign-in link, then open it on this device.</p>
        ) : (
          <>
            <p style={{ marginBottom: 16 }}>Sign in to sync your planner across devices.</p>
            <form onSubmit={handleSubmit}>
              <input
                className="input"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', marginBottom: 12 }}
              />
              <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%' }}>
                {submitting ? 'Sending…' : 'Send sign-in link'}
              </button>
            </form>
            {error && <p style={{ color: 'var(--color-accent)', marginTop: 12 }}>{error}</p>}
          </>
        )}
      </main>
    </div>
  );
}
