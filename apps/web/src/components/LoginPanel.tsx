import React, { useState, useEffect } from 'react';

interface LoginPanelProps {
  isConnected: boolean;
  onCommand: (cmd: string) => void;
  logs: any[];
  onPasswordSent?: () => void;
}

type FlowState = 'ACCOUNT' | 'INTERACTIVE' | 'LOADING';

export default function LoginPanel({ isConnected, onCommand, logs, onPasswordSent }: LoginPanelProps) {
  const [step, setStep] = useState<FlowState>('ACCOUNT');
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [genericInput, setGenericInput] = useState('');

  // Get the last system/message logs to show to the user during interactive steps
  const systemLogs = logs.filter(l => l.type === 'system').slice(-3);
  const lastLogText = systemLogs[systemLogs.length - 1]?.text || '';

  // Error and step detection based on server messages
  useEffect(() => {
    if (systemLogs.length === 0) return;
    const lowerLog = lastLogText.toLowerCase();

    if (lowerLog.includes('contraseña incorrecta') || lowerLog.includes('incorrect password')) {
      setError('Contraseña incorrecta.');
      setStep('ACCOUNT');
    } else if (lowerLog.includes('personajes disponibles') || lowerLog.includes('elije una raza') || lowerLog.includes('elije una clase')) {
      setStep('INTERACTIVE');
    }
  }, [lastLogText]);

  const handleAccountLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setError(null);
    localStorage.setItem('mud_user', username);
    localStorage.setItem('mud_pass', password);

    // Initial sequence
    onCommand(username);
    setTimeout(() => {
      onCommand(password);
      onPasswordSent?.();
    }, 400);

    setStep('LOADING');
  };

  const handleGenericSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!genericInput) return;
    onCommand(genericInput);
    setGenericInput('');
  };

  return (
    <div className="login-panel fade-in" style={{ padding: '1rem', width: '100%' }}>
      {!isConnected && (
        <div style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '1rem', textAlign: 'center', fontWeight: 'bold' }}>
          DESCONECTADO DEL SERVIDOR
        </div>
      )}

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid #ef4444',
          color: '#fca5a5',
          padding: '0.6rem',
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
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ color: 'var(--gold)', fontSize: '1.3rem', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>INHERON MUD</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Identifícate para entrar en el Reino.</p>
          </div>
          <div className="input-group">
            <label>Usuario</label>
            <input
              type="text"
              name="username"
              className="login-input"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Nombre de cuenta"
              autoComplete="username"
              autoFocus
            />
          </div>
          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              className="login-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button 
              type="button" 
              className="quick-btn" 
              style={{ flex: 1 }}
              onClick={() => { setUsername(''); setPassword(''); }}
            >
              Limpiar
            </button>
            <button type="submit" className="btn-primary" disabled={!isConnected} style={{ flex: 2 }}>
              CONECTAR
            </button>
          </div>
        </form>
      )}

      {(step === 'LOADING' || step === 'INTERACTIVE') && (
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <div className="spinner" style={{ marginBottom: '1.5rem' }}></div>
          
          <div style={{ 
            background: 'rgba(0,0,0,0.4)', 
            padding: '1rem', 
            borderRadius: '4px', 
            border: '1px solid var(--gold-dim)',
            marginBottom: '1.5rem',
            textAlign: 'left'
          }}>
            {systemLogs.map((log, i) => (
              <p key={i} style={{ 
                color: i === systemLogs.length - 1 ? 'var(--text-bright)' : 'var(--text-muted)', 
                fontSize: '0.8rem',
                marginBottom: '0.4rem',
                whiteSpace: 'pre-wrap'
              }}>
                {log.text}
              </p>
            ))}
          </div>

          {step === 'INTERACTIVE' ? (
            <form onSubmit={handleGenericSubmit}>
              <input
                type="text"
                className="login-input"
                value={genericInput}
                onChange={e => setGenericInput(e.target.value)}
                placeholder="Escribe tu elección..."
                autoFocus
                style={{ marginBottom: '1rem' }}
              />
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                ENVIAR
              </button>
            </form>
          ) : (
            <p style={{ color: 'var(--gold)', fontSize: '0.9rem', animation: 'pulse 2s infinite' }}>Estableciendo conexión arcana...</p>
          )}

          <button
            type="button"
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.7rem', cursor: 'pointer', marginTop: '2rem', textTransform: 'uppercase' }}
            onClick={() => setStep('ACCOUNT')}
          >
            ← Volver al inicio
          </button>
        </div>
      )}
    </div>
  );
}
