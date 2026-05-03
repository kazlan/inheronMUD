import React from 'react';

interface CharacterSheetProps {
  attributes: any;
}

export default function CharacterSheet({ attributes }: CharacterSheetProps) {
  // Support both direct attributes and nested score structure
  const derived = attributes.derived || {};
  const health = {
    current: derived.hpCurrent ?? attributes.health?.current ?? 0,
    max: derived.hpMax ?? attributes.health?.max ?? 100
  };
  const energy = {
    current: derived.energyCurrent ?? attributes.energy?.current ?? 0,
    max: derived.energyMax ?? attributes.energy?.max ?? 100
  };
  
  const experience = attributes.experience || { current: 0, max: 100 };
  const level = attributes.level || 1;
  const charStats = attributes.stats || attributes; // fallback to attributes root

  const stats = [
    { name: 'FUE', full: 'Fuerza', val: charStats.fuerza || 0, color: 'var(--stat-fuerza)' },
    { name: 'DES', full: 'Destreza', val: charStats.destreza || 0, color: 'var(--stat-destreza)' },
    { name: 'CON', full: 'Constitución', val: charStats.constitucion || 0, color: 'var(--stat-constitucion)' },
    { name: 'ING', full: 'Ingenio', val: charStats.ingenio || 0, color: 'var(--stat-ingenio)' },
    { name: 'SAB', full: 'Sabiduría', val: charStats.sabiduria || 0, color: 'var(--stat-sabiduria)' },
    { name: 'PRE', full: 'Presencia', val: charStats.presencia || 0, color: 'var(--stat-presencia)' },
    { name: 'PER', full: 'Percepción', val: charStats.percepcion || 0, color: 'var(--stat-percepcion)' },
  ];

  return (
    <div className="glass-panel character-sheet">
      <div className="panel-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        Hoja de Personaje
      </div>

      <div style={{ textAlign: 'center', marginBottom: '0.75rem', position: 'relative' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-bright)', textShadow: '0 0 10px var(--gold-dim)' }}>
          {attributes.name || 'Viajero'}
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '2px' }}>
          Nivel {level} — {attributes.class || 'Sin Clase'}
        </div>
      </div>
      
      <div className="stat-bar-container">
        <div className="stat-bar-header"><span>❤ Salud</span><span>{health.current} / {health.max}</span></div>
        <div className="stat-bar-bg"><div className="stat-bar-fill hp" style={{ width: `${Math.min(100, (health.current / health.max) * 100)}%` }}></div></div>
      </div>
      <div className="stat-bar-container">
        <div className="stat-bar-header"><span>✦ Energía</span><span>{energy.current} / {energy.max}</span></div>
        <div className="stat-bar-bg"><div className="stat-bar-fill mp" style={{ width: `${Math.min(100, (energy.current / energy.max) * 100)}%` }}></div></div>
      </div>

      <div className="stat-bar-container" style={{ marginBottom: '1.2rem' }}>
        <div className="stat-bar-header" style={{ fontSize: '0.65rem' }}><span>✧ Experiencia</span><span>{experience?.current || 0}%</span></div>
        <div className="stat-bar-bg" style={{ height: '6px' }}><div className="stat-bar-fill sp" style={{ width: `${experience?.current || 0}%` }}></div></div>
      </div>

      <div className="stats-section">
        <div className="attributes-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))' }}>
          {stats.map(s => (
            <div key={s.name} className="attribute-item compact" title={s.full}>
              <span className="attribute-name" style={{ color: s.color }}>{s.name}</span>
              <span className="attribute-val">{s.val}</span>
            </div>
          ))}
        </div>
      </div>

      {attributes.reputation && Object.keys(attributes.reputation).length > 0 && (
        <div className="reputation-section" style={{ marginTop: '1rem', borderTop: '1px solid var(--gold-dim)', paddingTop: '0.8rem' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem', letterSpacing: '0.1em' }}>Reputación</div>
          {Object.entries(attributes.reputation).map(([faction, value]: [string, any]) => (
            <div key={faction} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '2px' }}>
              <span style={{ color: 'var(--text-main)' }}>{faction}</span>
              <span style={{ color: 'var(--blue-bright)' }}>{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
