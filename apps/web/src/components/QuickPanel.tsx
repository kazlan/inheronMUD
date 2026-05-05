import React from 'react';

interface QuickPanelProps {
  onCommand: (cmd: string) => void;
  onOpenPanel: (panel: 'inventory' | 'equipment' | 'quests' | 'character') => void;
  room?: {
    id: string;
    title: string;
    exits: string[];
  };
}

export default function QuickPanel({ onCommand, onOpenPanel, room }: QuickPanelProps) {
  const availableExits = room?.exits || [];
  const hasExit = (dir: string) => availableExits.includes(dir);

  // Minimap 9x9 grid
  // Center is index 40 (row 4, col 4)
  const mapCells = Array.from({ length: 81 }, (_, i) => {
    let className = 'minimap-cell';
    let dir = '';
    
    if (i === 40) {
      className += ' active';
    } else if (i === 31 && hasExit('north')) dir = 'north';
    else if (i === 49 && hasExit('south')) dir = 'south';
    else if (i === 41 && hasExit('east')) dir = 'east';
    else if (i === 39 && hasExit('west')) dir = 'west';
    else if (i === 30 && hasExit('northwest')) dir = 'northwest';
    else if (i === 32 && hasExit('northeast')) dir = 'northeast';
    else if (i === 48 && hasExit('southwest')) dir = 'southwest';
    else if (i === 50 && hasExit('southeast')) dir = 'southeast';

    if (dir) className += ' path';
    
    return { i, className, dir };
  });

  return (
    <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.3rem' }}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
        {room?.title || 'Map'}
      </div>
      <div className="minimap-container" style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', marginBottom: '1rem' }}>
        <div className="minimap-grid" style={{ gridTemplateColumns: 'repeat(9, 1fr)', width: '100%', maxWidth: '200px', margin: '0 auto', aspectRatio: '1' }}>
          {mapCells.map((cell) => (
            <div 
              key={cell.i} 
              className={cell.className}
              onClick={() => cell.dir && onCommand(cell.dir)}
              style={{ cursor: cell.dir ? 'pointer' : 'default', opacity: (cell.className.includes('active') || cell.dir) ? 1 : 0.05 }}
            >
              {/* Draw lines radiating from the center node */}
              {cell.i === 40 && (
                <>
                  {hasExit('north') && <div className="minimap-line vertical" style={{ height: '100%', top: '-50%' }} />}
                  {hasExit('south') && <div className="minimap-line vertical" style={{ height: '100%', top: '50%' }} />}
                  {hasExit('east') && <div className="minimap-line horizontal" style={{ width: '100%', left: '50%' }} />}
                  {hasExit('west') && <div className="minimap-line horizontal" style={{ width: '100%', left: '-50%' }} />}
                  {hasExit('northwest') && <div className="minimap-line diagonal-nw-se" style={{ top: '-50%', left: '-50%', width: '141%' }} />}
                  {hasExit('southeast') && <div className="minimap-line diagonal-nw-se" style={{ top: '50%', left: '50%', width: '141%' }} />}
                  {hasExit('northeast') && <div className="minimap-line diagonal-ne-sw" style={{ top: '-50%', left: '50%', width: '141%' }} />}
                  {hasExit('southwest') && <div className="minimap-line diagonal-ne-sw" style={{ top: '50%', left: '-50%', width: '141%' }} />}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="panel-title">Navegación</div>
      <div className="compass-grid vertical-nav">
        <button className={`compass-btn ${hasExit('northwest') ? 'active-exit' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => onCommand('nw')}>NO</button>
        <button className={`compass-btn ${hasExit('north') ? 'active-exit' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => onCommand('n')}>N</button>
        <button className={`compass-btn ${hasExit('northeast') ? 'active-exit' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => onCommand('ne')}>NE</button>
        <button className={`compass-btn up-btn ${hasExit('up') ? 'active-exit' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => onCommand('up')}>▲ Subir</button>
        
        <button className={`compass-btn ${hasExit('west') ? 'active-exit' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => onCommand('w')}>O</button>
        <button className="compass-btn empty"></button>
        <button className={`compass-btn ${hasExit('east') ? 'active-exit' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => onCommand('e')}>E</button>
        <button className={`compass-btn down-btn ${hasExit('down') ? 'active-exit' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => onCommand('down')}>▼ Bajar</button>
        
        <button className={`compass-btn ${hasExit('southwest') ? 'active-exit' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => onCommand('sw')}>SO</button>
        <button className={`compass-btn ${hasExit('south') ? 'active-exit' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => onCommand('s')}>S</button>
        <button className={`compass-btn ${hasExit('southeast') ? 'active-exit' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => onCommand('se')}>SE</button>
        <button className="compass-btn empty"></button>
      </div>

      <div className="panel-title">Paneles</div>
      <div className="quick-buttons-grid">
        <button className="quick-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => onOpenPanel('inventory')}>⬡ Inv</button>
        <button className="quick-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => onOpenPanel('equipment')}>⛊ Equipo</button>
        <button className="quick-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => onOpenPanel('quests')}>📜 Misiones</button>
      </div>

      <div className="panel-title" style={{ marginTop: 'auto' }}>Acciones</div>
      <div className="quick-buttons-grid">
        <button className="quick-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => onCommand('look')}>Ver</button>
        <button className="quick-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => onCommand('score')}>Ficha</button>
        <button className="quick-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => onCommand('rest')}>Descansar</button>
        <button className="quick-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => onCommand('stand')}>Levantarse</button>
        <button className="quick-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => onCommand('help')}>Ayuda</button>
        <button className="quick-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => onCommand('cast')}>Hechizo</button>
      </div>
    </div>
  );
}
