import React from 'react';

interface CharacterSheetProps {
  attributes: any;
  effects?: any[];
}

export default function CharacterSheet({ attributes, effects }: CharacterSheetProps) {
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

  const formatName = (id: string) => {
    if (!id) return 'Sin Clase';
    const specialCases: Record<string, string> = {
      'bardo_cronica_viva': 'Bardo',
      'caballero_alba': 'Caballero del Alba',
      'clerigo_sanador': 'Clérigo Sanador',
      'humano_altherion': 'Humano de Altherion',
      'humano_arvell': 'Humano de Arvell',
    };
    if (specialCases[id]) return specialCases[id];
    return id.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getColor = (id: string) => {
    const classColors: Record<string, string> = {
      'bardo_cronica_viva': 'var(--arcane-purple)',
      'caballero_alba': 'var(--yellow)',
      'clerigo_sol_quieto': 'var(--blue-bright)',
      'inquisidor_llama': 'var(--hp-color)',
      'guardian_roca': 'var(--stat-constitucion)',
    };
    return classColors[id] || 'var(--text-bright)';
  };

  const classColor = getColor(attributes.class);

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
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: classColor, textShadow: `0 0 10px ${classColor}44` }}>
          {attributes.name || 'Viajero'}
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '2px' }}>
          Nivel {level} — <span style={{ color: classColor }}>{formatName(attributes.class)}</span>
        </div>
      </div>
      
      <div className="stat-bar-container">
        <div className="stat-bar-header"><span>❤ Salud</span><span>{health.current} / {health.max}</span></div>
        <div className="stat-bar-bg"><div className="stat-bar-fill hp" style={{ width: `${Math.min(100, (health.current / health.max) * 100)}%` }}></div></div>
      </div>
      <div className="stat-bar-container">
        <div className="stat-bar-header"><span>{attributes.class === 'bardo_cronica_viva' ? '🎵 Voz' : '✦ Energía'}</span><span>{energy.current} / {energy.max}</span></div>
        <div className="stat-bar-bg"><div className="stat-bar-fill mp" style={{ width: `${Math.min(100, (energy.current / energy.max) * 100)}%` }}></div></div>
      </div>

      <div className="stat-bar-container" style={{ marginBottom: '1.2rem' }}>
        <div className="stat-bar-header" style={{ fontSize: '0.65rem' }}><span>✧ Experiencia</span><span>{experience?.current || 0}%</span></div>
        <div className="stat-bar-bg" style={{ height: '6px' }}><div className="stat-bar-fill sp" style={{ width: `${experience?.current || 0}%` }}></div></div>
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

      {attributes.bardState && (
        <div className="bard-section glass-panel" style={{ marginTop: '0.5rem', border: '1px solid var(--magenta)', background: 'rgba(255, 0, 255, 0.05)' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--magenta)', marginBottom: '0.4rem', letterSpacing: '0.1em', display: 'flex', justifyContent: 'space-between' }}>
            <span>Crónica Viva</span>
            {attributes.bardState.freeSustainAvailable && <span style={{ color: 'var(--green-bright)' }}>★ Sostener</span>}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
            <span style={{ color: 'var(--text-main)' }}>Aplausos: <span style={{ color: 'var(--yellow)' }}>{attributes.bardState.aplauso || 0}</span></span>
            <span style={{ color: 'var(--text-main)' }}>Estrofa: <span style={{ color: 'var(--cyan)' }}>{attributes.bardState.estrofa || 0} / 3</span></span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
            <span style={{ color: 'var(--text-main)' }}>Trama Máxima: <span style={{ color: 'var(--cyan)' }}>{attributes.bardState.tramaMax || 1}</span></span>
          </div>
        </div>
      )}
      {effects && effects.length > 0 && (
        <div className="char-effects-section" style={{ marginTop: '1rem', borderTop: '1px solid var(--gold-dim)', paddingTop: '0.8rem' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem', letterSpacing: '0.1em' }}>Efectos Activos</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {effects.map((effect, idx) => {
              const remainingMs = Math.max(0, (effect.startTime + effect.duration) - Date.now());
              const remainingMin = Math.ceil(remainingMs / 60000);
              const progress = (remainingMs / effect.duration) * 100;
              const isEcho = effect.isEcho || effect.name.toLowerCase().includes('eco');
              
              return (
                <div key={`${effect.id}-${idx}`} className="char-effect-row" title={effect.description} style={{ opacity: isEcho ? 0.6 : 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <span style={{ color: isEcho ? '#888' : (effect.type === 'debuff' ? 'var(--red)' : 'var(--cyan)') }}>
                      {effect.name}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>
                      {remainingMin}m
                    </span>
                  </div>
                  <div className="effect-progress-bg" style={{ height: '2px', marginTop: '2px', background: 'rgba(255,255,255,0.05)' }}>
                    <div 
                      className="effect-progress-fill" 
                      style={{ 
                        width: `${progress}%`,
                        height: '100%',
                        backgroundColor: isEcho ? '#444' : (effect.type === 'debuff' ? 'var(--red)' : 'var(--cyan)'),
                        boxShadow: isEcho ? 'none' : `0 0 4px ${effect.type === 'debuff' ? 'var(--red)' : 'var(--cyan)'}`,
                        transition: 'width 1s linear'
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
