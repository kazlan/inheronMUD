import React, { useState, useEffect } from 'react';

interface LoginPanelProps {
  isConnected: boolean;
  onCommand: (cmd: string) => void;
  logs: any[];
  onPasswordSent?: () => void;
}

type FlowState = 'ACCOUNT' | 'LOADING';

export default function LoginPanel({ isConnected, onCommand, logs, onPasswordSent }: LoginPanelProps) {
  const [step, setStep] = useState<FlowState>('ACCOUNT');
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState(localStorage.getItem('mud_user') || '');
  const [password, setPassword] = useState(localStorage.getItem('mud_pass') || '');

  // Error detection: if server sends an error message, return to ACCOUNT step
  useEffect(() => {
    if (logs.length === 0) return;
    const lastLog = logs[logs.length - 1].text.toLowerCase();

    if (lastLog.includes('not found') || lastLog.includes('invalid') || lastLog.includes('error') || lastLog.includes('incorrect')) {
      setError(lastLog);
      setStep('ACCOUNT');
    }
  }, [logs]);

  const handleAccountLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setError(null);
    localStorage.setItem('mud_user', username);
    localStorage.setItem('mud_pass', password);

    // Send username, then password; lift curtain after password is sent
    onCommand(username);
    setTimeout(() => {
      onCommand(password);
      onPasswordSent?.();
    }, 500);

    setStep('LOADING');
  };

  return (
    <div className="login-panel fade-in" style={{ padding: '1rem' }}>
      {!isConnected && (
        <div style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '1rem', textAlign: 'center' }}>
          Disconnected from server.
        </div>
      )}

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid #ef4444',
          color: '#fca5a5',
          padding: '0.5rem',
          borderRadius: '4px',
          fontSize: '0.75rem',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          ⚠️ {error}
        </div>
      )}

      {step === 'ACCOUNT' && (
        <form className="login-form" onSubmit={handleAccountLogin}>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <h2 style={{ color: 'var(--gold)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Account Login</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Welcome back, adventurer.</p>
          </div>
          <div className="input-group">
            <label>👤 Account Name</label>
            <input
              type="text"
              className="login-input"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Username"
              autoFocus
            />
          </div>
          <div className="input-group">
            <label>🔑 Password</label>
            <input
              type="password"
              className="login-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-primary" disabled={!isConnected} style={{ marginTop: '0.5rem' }}>
            Enter Inheron
          </button>
        </form>
      )}

      {step === 'LOADING' && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="spinner" style={{ marginBottom: '1rem' }}></div>
          <p style={{ color: 'var(--gold)', fontSize: '0.9rem' }}>Entering the world...</p>
          <button
            type="button"
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer', marginTop: '1rem' }}
            onClick={() => setStep('ACCOUNT')}
          >
            ← Cancel / Fix Login
          </button>
        </div>
      )}
    </div>
  );
}
