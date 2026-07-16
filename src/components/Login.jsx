import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setNotice('');
    setSubmitting(true);

    try {
      const { data, error } =
        mode === 'signup'
          ? await supabase.auth.signUp({ email, password })
          : await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setError(error.message);
        return;
      }
      // On successful sign-in, App's auth listener takes over automatically.
      // On sign-up, if email confirmation is on, there's no session yet.
      if (mode === 'signup' && !data.session) {
        setNotice('Account created. If asked, confirm via the email we sent, then sign in.');
        setMode('signin');
      }
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="app-shell">
      <main className="app-main" style={{ paddingTop: 48 }}>
        <h1 style={{ marginBottom: 8 }}>Simple Plan</h1>
        <p style={{ marginBottom: 16 }}>
          {mode === 'signup'
            ? 'Create an account to sync your planner across devices.'
            : 'Sign in to sync your planner across devices.'}
        </p>

        <form onSubmit={handleSubmit}>
          <input
            className="input"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', marginBottom: 12 }}
          />
          <input
            className="input"
            type="password"
            required
            minLength={6}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            placeholder="Password (at least 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', marginBottom: 12 }}
          />
          <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%' }}>
            {submitting ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}
          </button>
        </form>

        {error && <p style={{ color: 'var(--color-accent)', marginTop: 12 }}>{error}</p>}
        {notice && <p style={{ marginTop: 12 }}>{notice}</p>}

        <button
          type="button"
          className="btn btn-ghost"
          style={{ marginTop: 16 }}
          onClick={() => {
            setError('');
            setNotice('');
            setMode(mode === 'signup' ? 'signin' : 'signup');
          }}
        >
          {mode === 'signup' ? 'Already have an account? Sign in' : "New here? Create an account"}
        </button>
      </main>
    </div>
  );
}
