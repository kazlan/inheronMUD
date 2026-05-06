import React from 'react';
import Minimap from './Minimap';

interface QuickPanelProps {
  onCommand: (cmd: string) => void;
  onOpenPanel: (panel: 'inventory' | 'equipment' | 'quests' | 'character' | 'map') => void;
  room?: any;
  inCombat?: boolean;
  pulse?: any[];
  areaMap?: Record<string, any>;
  visitedRooms?: string[];
  isLoaded?: boolean;
}

export default function QuickPanel({ onCommand, onOpenPanel, room, inCombat, pulse, areaMap = {}, visitedRooms = [], isLoaded = false }: QuickPanelProps) {
  const currentRoom = room?.room || room;
  const availableExits = currentRoom?.exits || [];
  const hasExit = (dir: string) => availableExits.some((e: any) => (e.direction || e).toLowerCase() === dir);

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

      <div className="minimap-container" style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.1)', borderRadius: '4px', marginBottom: '1rem', position: 'relative' }}>
        <Minimap 
          areaMap={areaMap} 
          currentRoomId={currentRoom?.id} 
          visitedRooms={visitedRooms} 
        />
        <div 
          className="map-loading-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            background: '#050505',
            zIndex: 10,
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.7rem',
            color: 'var(--gold-dim)',
            transition: 'opacity 1.5s ease',
            opacity: isLoaded ? 0 : 1,
            pointerEvents: isLoaded ? 'none' : 'auto',
            border: '1px solid rgba(201, 168, 76, 0.1)'
          }}
        >
          Sincronizando...
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
