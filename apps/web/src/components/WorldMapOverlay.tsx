import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WorldMapOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  areaMap: Record<string, any>;
  visitedRooms: string[];
  currentRoomId?: string;
}

export default function WorldMapOverlay({ isOpen, onClose, areaMap, visitedRooms, currentRoomId }: WorldMapOverlayProps) {
  if (!isOpen) return null;

  const rooms = Object.values(areaMap);
  if (rooms.length === 0) return null;

  // Calculate bounds
  const minX = Math.min(...rooms.map(r => r.x));
  const maxX = Math.max(...rooms.map(r => r.x));
  const minY = Math.min(...rooms.map(r => r.y));
  const maxY = Math.max(...rooms.map(r => r.y));

  const width = maxX - minX + 1;
  const height = maxY - minY + 1;

  // Determine area name from first room
  const areaName = rooms[0].areaId.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <AnimatePresence>
      <motion.div 
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          backdropFilter: 'blur(10px)'
        }}
      >
        <motion.div 
          className="world-map-modal glass-panel"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={e => e.stopPropagation()}
          style={{
            width: '90vw',
            height: '85vh',
            maxWidth: '1000px',
            display: 'flex',
            flexDirection: 'column',
            padding: '2rem'
          }}
        >
          <div className="panel-title flex justify-between items-center" style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
            <span>
              <span style={{ color: 'var(--gold)' }}>[</span> CARTOGRAFÍA DE {areaName.toUpperCase()} <span style={{ color: 'var(--gold)' }}>]</span>
            </span>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.5rem' }}>×</button>
          </div>

          <div className="map-scroll-container" style={{ 
            flex: 1, 
            overflow: 'auto', 
            background: 'rgba(0,0,0,0.4)', 
            borderRadius: '8px', 
            padding: '3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
             <div className="map-grid-full" style={{
               display: 'grid',
               gridTemplateColumns: `repeat(${width}, 40px)`,
               gridTemplateRows: `repeat(${height}, 40px)`,
               gap: '8px',
               position: 'relative'
             }}>
               {Array.from({ length: width * height }).map((_, i) => {
                 const x = minX + (i % width);
                 const y = minY + Math.floor(i / width);
                 const room = rooms.find(r => r.x === x && r.y === y);
                 const isVisited = room ? visitedRooms.includes(room.id) : false;
                 const isCurrent = room?.id === currentRoomId;

                 if (!isVisited) return <div key={i} className="map-empty-cell" style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.02)', borderRadius: '2px' }} />;

                 return (
                   <motion.div 
                     key={i}
                     className={`map-node ${isCurrent ? 'current' : ''} ${room?.isShop ? 'shop' : ''}`}
                     whileHover={{ scale: 1.1, zIndex: 10 }}
                     style={{
                       width: 40,
                       height: 40,
                       background: isCurrent ? 'var(--gold)' : (room?.isShop ? 'var(--arcane-purple)' : 'rgba(201, 168, 76, 0.4)'),
                       border: '1px solid var(--gold-dim)',
                       borderRadius: '4px',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       cursor: 'help',
                       boxShadow: isCurrent ? '0 0 15px var(--gold-glow)' : 'none',
                       position: 'relative'
                     }}
                     title={room?.name}
                   >
                     {isCurrent && <div className="player-pulse" style={{ width: 10, height: 10, background: '#fff', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />}
                     <div className="node-label" style={{ 
                       position: 'absolute', 
                       bottom: '-18px', 
                       fontSize: '0.6rem', 
                       whiteSpace: 'nowrap', 
                       color: isCurrent ? 'var(--gold)' : 'var(--text-muted)',
                       fontWeight: isCurrent ? 'bold' : 'normal'
                     }}>
                       {room?.name.split(' ').slice(0, 2).join(' ')}
                     </div>
                   </motion.div>
                 );
               })}
             </div>
          </div>

          <div className="map-footer" style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <div className="legend-item flex items-center gap-2">
              <div style={{ width: 12, height: 12, background: 'var(--gold)', borderRadius: '2px' }} /> Ubicación Actual
            </div>
            <div className="legend-item flex items-center gap-2">
              <div style={{ width: 12, height: 12, background: 'rgba(201, 168, 76, 0.4)', borderRadius: '2px' }} /> Exploratado
            </div>
            <div className="legend-item flex items-center gap-2">
              <div style={{ width: 12, height: 12, background: 'var(--arcane-purple)', borderRadius: '2px' }} /> Comerciante / Punto de Interés
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
