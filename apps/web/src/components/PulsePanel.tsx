import React from 'react';

interface PulseOption {
  name: string;
  reason: string;
  type?: string;
  skillId?: string;
}

interface PulsePanelProps {
  options: PulseOption[];
  onOptionClick: (index: number) => void;
  inCombat: boolean;
  activeEffects?: any[];
  targets?: any[];
}

export default function PulsePanel({ options, onOptionClick, inCombat, activeEffects = [], targets = [] }: PulsePanelProps) {
  const [, setTick] = React.useState(0);

  // Force re-render every second to update timers
  React.useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!inCombat) return null;

  const getBucketColor = (type?: string) => {
    switch (type) {
      case 'damage': return 'var(--hp-color)';
      case 'buff': return 'var(--blue-bright)';
      case 'heal': return 'var(--green-bright)';
      case 'utility': return 'var(--gold)';
      case 'reaction': return 'var(--cyan)';
      case 'control': return 'var(--arcane-purple)';
      case 'sustain': return 'var(--gold)';
      case 'environment': return 'var(--green)';
      case 'memory': return 'var(--gold-bright)';
      default: return 'var(--gold)';
    }
  };

  const getBucketIcon = (type?: string) => {
    switch (type) {
      case 'damage': return '🟥';
      case 'buff': return '🟦';
      case 'heal': return '🟩';
      case 'utility': return '◻️';
      case 'reaction': return '⚡';
      case 'control': return '🟪';
      case 'sustain': return '🟨';
      case 'environment': return '🌿';
      case 'memory': return '📜';
      default: return '✨';
    }
  };

  // Collect all relevant short-term effects
  const combatEffects: any[] = [];
  
  // 1. My short buffs
  activeEffects.forEach(eff => {
    if ((eff.duration || 0) < 600000) { // Under 10 mins
      combatEffects.push({ ...eff, origin: 'self' });
    }
  });

  // 2. Target debuffs
  targets.forEach(t => {
    (t.activeEffects || []).forEach((eff: any) => {
      combatEffects.push({ ...eff, origin: t.name, targetId: t.id });
    });
  });

  return (
    <div className="pulse-panel fade-in">
      <div className="pulse-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="pulse-icon">⚡</span>
          <span className="pulse-title">PULSO TÁCTICO</span>
        </div>
      </div>

      {combatEffects.length > 0 && (
        <div className="combat-monitor" style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '1rem', padding: '0 0.6rem' }}>
          {combatEffects.map((eff, i) => {
            const remainingMs = Math.max(0, (eff.startTime + eff.duration) - Date.now());
            const progress = (remainingMs / eff.duration) * 100;
            const isSelf = eff.origin === 'self';
            const isEcho = eff.isEcho || eff.name.toLowerCase().includes('eco');
            
            return (
              <div 
                key={i} 
                className={`monitor-card ${isEcho ? 'echo-effect' : ''}`} 
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: isEcho ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)', 
                  padding: '4px 8px', 
                  borderRadius: '2px', 
                  borderLeft: `3px solid ${isEcho ? '#444' : (isSelf ? 'var(--blue-bright)' : 'var(--hp-color)')}`,
                  opacity: isEcho ? 0.7 : 1,
                }}
              >
                <div style={{ flex: '1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ 
                    color: isEcho ? '#aaa' : 'white', 
                    fontSize: '0.65rem',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {eff.name}
                  </span>
                  <span style={{ fontSize: '0.55rem', opacity: 0.5, marginLeft: '4px' }}>
                    {isSelf ? 'TI' : eff.origin.substring(0, 5)}
                  </span>
                </div>
                
                <div className="stat-bar-bg" style={{ width: '60px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '1px', overflow: 'hidden' }}>
                  <div 
                    className="stat-bar-fill" 
                    style={{ 
                      width: `${progress}%`, 
                      height: '100%',
                      background: isEcho ? '#444' : (isSelf ? 'var(--cyan)' : 'var(--hp-color)'),
                      boxShadow: isEcho ? 'none' : `0 0 4px ${isSelf ? 'var(--cyan)' : 'var(--hp-color)'}`,
                      transition: 'width 1s linear'
                    }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {options.length > 0 ? (
        <div className="pulse-options">
        {options.map((opt, i) => (
          <button 
            key={i} 
            className="pulse-option-btn glass-panel"
            onClick={() => onOptionClick(i + 1)}
            style={{ '--pulse-color': getBucketColor(opt.type) } as React.CSSProperties}
          >
            <div className="pulse-option-top">
              <span className="pulse-option-icon">{getBucketIcon(opt.type)}</span>
              <span className="pulse-option-index">{i + 1}</span>
              <span className="pulse-option-name">{opt.name}</span>
            </div>
            <div className="pulse-option-reason">{opt.reason}</div>
          </button>
        ))}
      </div>
      ) : (
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem', fontStyle: 'italic' }}>
          Esperando apertura táctica...
        </div>
      )}
    </div>
  );
}
