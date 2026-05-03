import React from 'react';

interface CombatPanelProps {
  targets: any[];
  effects: any[];
  onCommand: (cmd: string) => void;
}

export default function CombatPanel({ targets, effects, onCommand }: CombatPanelProps) {
  return (
    <div className="glass-panel combat-panel fade-in" style={{ borderImage: 'linear-gradient(180deg, var(--hp-color) 0%, var(--gold) 100%) 1' }}>
      <div className="panel-title" style={{ color: 'var(--hp-color)', borderBottomColor: 'var(--hp-glow)' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.3rem' }}>
          <path d="M14.5 2L12 4.5 9.5 2 7 4.5 9.5 7 7 9.5 9.5 12 7 14.5 9.5 17 7 19.5 9.5 22 12 19.5 14.5 22 17 19.5 14.5 17 17 14.5 14.5 12 17 9.5 14.5 7 17 4.5 14.5 2z"/>
        </svg>
        EN COMBATE
      </div>

      <div className="targets-section" style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>Objetivos</div>
        {targets.map((target, idx) => (
          <div key={target.uuid || idx} className="target-card" style={{ background: 'rgba(0,0,0,0.3)', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--hp-glow)', marginBottom: '0.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-bright)' }}>{target.name}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--hp-color)' }}>Nivel {target.level || '?'}</span>
            </div>
            {target.health && (
              <div className="stat-bar-bg" style={{ height: '6px' }}>
                <div className="stat-bar-fill hp" style={{ width: `${(target.health.current / target.health.max) * 100}%` }}></div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="actions-section">
        <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>Acciones Rápidas</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
          <button className="quick-btn" style={{ borderColor: 'var(--hp-color)', color: 'var(--hp-color)' }} onClick={() => onCommand('attack')}>Atacar</button>
          <button className="quick-btn" style={{ borderColor: 'var(--mp-color)', color: 'var(--mp-color)' }} onClick={() => onCommand('cast')}>Hechizo</button>
          <button className="quick-btn" onClick={() => onCommand('skills')}>Habilidades</button>
          <button className="quick-btn" onClick={() => onCommand('use')}>Objeto</button>
          <button className="quick-btn" onClick={() => onCommand('flee')} style={{ gridColumn: 'span 2', marginTop: '0.4rem', fontSize: '0.7rem', opacity: 0.8 }}>Intentar Huir</button>
        </div>
      </div>

      {effects && effects.length > 0 && (
        <div className="effects-section" style={{ marginTop: '1rem', borderTop: '1px solid var(--gold-dim)', paddingTop: '0.8rem' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem', letterSpacing: '0.1em' }}>Estados</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {effects.map((effect, idx) => (
              <div key={idx} title={effect.description} style={{ fontSize: '0.65rem', padding: '2px 6px', background: 'rgba(74, 158, 222, 0.2)', border: '1px solid var(--blue-gem)', borderRadius: '2px', color: 'var(--blue-bright)' }}>
                {effect.name} ({effect.duration}r)
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
