import React from 'react';

interface QuickPanelProps {
  onCommand: (cmd: string) => void;
  onOpenPanel: (panel: 'inventory' | 'equipment' | 'quests' | 'character' | 'map') => void;
  room?: any;
  inCombat?: boolean;
  pulse?: any[];
  areaMap?: Record<string, any>;
  visitedRooms?: string[];
}

export default function QuickPanel({ onCommand, onOpenPanel, room, inCombat, pulse, areaMap = {}, visitedRooms = [] }: QuickPanelProps) {
  const currentRoom = room?.room || room;
  const availableExits = currentRoom?.exits || [];
  const hasExit = (dir: string) => availableExits.some((e: any) => (e.direction || e).toLowerCase() === dir);

  // Minimap 9x9 grid (Radius 4)
  const currentCoord = areaMap[currentRoom?.id] || { x: 0, y: 0 };
  
  const mapCells = [];
  for (let dy = -4; dy <= 4; dy++) {
    for (let dx = -4; dx <= 4; dx++) {
      const targetX = currentCoord.x + dx;
      const targetY = currentCoord.y + dy;
      
      // Find room at these coordinates
      const roomAtCoord = Object.values(areaMap).find(r => r.x === targetX && r.y === targetY);
      const isVisited = roomAtCoord ? visitedRooms.includes(roomAtCoord.id) : false;
      const isCurrent = roomAtCoord?.id === currentRoom?.id;
      
      let className = 'minimap-cell';
      if (isCurrent) className += ' active';
      else if (isVisited) {
        className += ' visited';
        if (roomAtCoord?.isShop) className += ' shop';
      }

      mapCells.push({ 
        x: dx, 
        y: dy, 
        room: isVisited ? roomAtCoord : null,
        className,
        isCurrent
      });
    }
  }

  return (
    <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-title flex justify-between items-center">
        <div className="flex items-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.3rem' }}>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          {currentRoom?.name || 'Mapa'}
        </div>
        <button 
          className="map-expand-btn" 
          onClick={() => onOpenPanel('map')}
          title="Ver mapa de zona"
          style={{ background: 'transparent', border: 'none', color: 'var(--gold)', cursor: 'pointer' }}
        >
          ⛶
        </button>
      </div>

      <div className="minimap-container" style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', marginBottom: '1rem', position: 'relative' }}>
        <div className="minimap-grid" style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(9, 1fr)', 
          width: '100%', 
          maxWidth: '220px', 
          margin: '0 auto', 
          aspectRatio: '1',
          gap: '1px'
        }}>
          {mapCells.map((cell, idx) => (
            <div 
              key={idx} 
              className={cell.className}
              title={cell.room?.name}
              style={{ 
                aspectRatio: '1',
                background: cell.isCurrent ? 'var(--gold)' : (cell.room?.isShop ? 'var(--arcane-purple)' : (cell.room ? 'rgba(201, 168, 76, 0.3)' : 'rgba(255,255,255,0.03)')),
                border: cell.room ? '1px solid rgba(201, 168, 76, 0.2)' : 'none',
                borderRadius: '1px',
                position: 'relative'
              }}
            >
              {cell.isCurrent && <div className="player-dot" />}
            </div>
          ))}
        </div>
      </div>

      <div className="panel-title">Navegación</div>
      <div className="compass-grid vertical-nav">
        <button className={`compass-btn ${hasExit('northwest') || hasExit('nw') ? 'active-exit' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => onCommand('nw')}>NO</button>
        <button className={`compass-btn ${hasExit('north') || hasExit('n') ? 'active-exit' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => onCommand('n')}>N</button>
        <button className={`compass-btn ${hasExit('northeast') || hasExit('ne') ? 'active-exit' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => onCommand('ne')}>NE</button>
        <button className={`compass-btn up-btn ${hasExit('up') ? 'active-exit' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => onCommand('up')}>▲ Subir</button>
        
        <button className={`compass-btn ${hasExit('west') || hasExit('w') ? 'active-exit' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => onCommand('w')}>O</button>
        <button className="compass-btn empty"></button>
        <button className={`compass-btn ${hasExit('east') || hasExit('e') ? 'active-exit' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => onCommand('e')}>E</button>
        <button className={`compass-btn down-btn ${hasExit('down') ? 'active-exit' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => onCommand('down')}>▼ Bajar</button>
        
        <button className={`compass-btn ${hasExit('southwest') || hasExit('sw') ? 'active-exit' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => onCommand('sw')}>SO</button>
        <button className={`compass-btn ${hasExit('south') || hasExit('s') ? 'active-exit' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => onCommand('s')}>S</button>
        <button className={`compass-btn ${hasExit('southeast') || hasExit('se') ? 'active-exit' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => onCommand('se')}>SE</button>
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
        <button className="quick-btn" style={{ borderColor: 'var(--magenta)', color: 'var(--magenta)' }} onMouseDown={(e) => e.preventDefault()} onClick={() => onCommand('pulso')}>Pulso</button>
      </div>
    </div>
  );
}
