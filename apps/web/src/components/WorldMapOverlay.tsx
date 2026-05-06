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
            padding: '1rem',
            position: 'relative'
          }}>
             <svg 
               width={width * 80 + 200} 
               height={height * 80 + 200} 
               viewBox={`${minX * 80 - 100} ${minY * 80 - 100} ${width * 80 + 200} ${height * 80 + 200}`}
               style={{ cursor: 'grab' }}
             >
                {/* Lines first */}
                {rooms.map(room => {
                  const isVisited = visitedRooms.includes(room.id);
                  if (!isVisited) return null;
                  return (room.exits || []).map((exit: any, idx: number) => {
                    const target = areaMap[exit.targetRoomId];
                    if (!target || !visitedRooms.includes(target.id)) return null;
                    return (
                      <line 
                        key={`${room.id}-${idx}`}
                        x1={room.x * 80} y1={room.y * 80}
                        x2={target.x * 80} y2={target.y * 80}
                        stroke="rgba(201, 168, 76, 0.3)"
                        strokeWidth="2"
                      />
                    );
                  });
                })}

                {/* Nodes */}
                {rooms.map(room => {
                  const isVisited = visitedRooms.includes(room.id);
                  const isCurrent = room.id === currentRoomId;
                  if (!isVisited) return null;

                  let color = 'rgba(201, 168, 76, 0.4)';
                  if (isCurrent) color = 'var(--gold)';
                  else if (room.isShop) color = 'var(--arcane-purple)';

                  return (
                    <g key={room.id} style={{ cursor: 'pointer' }}>
                      <rect 
                        x={room.x * 80 - 15} 
                        y={room.y * 80 - 15} 
                        width="30" 
                        height="30" 
                        fill={color}
                        stroke={isCurrent ? '#fff' : 'rgba(255,255,255,0.2)'}
                        strokeWidth={isCurrent ? 2 : 1}
                        rx="4"
                      />
                      <text 
                        x={room.x * 80} 
                        y={room.y * 80 + 30} 
                        fill={isCurrent ? 'var(--gold)' : 'var(--text-muted)'}
                        fontSize="10"
                        textAnchor="middle"
                        style={{ fontWeight: isCurrent ? 'bold' : 'normal', textShadow: '0 0 4px rgba(0,0,0,0.8)' }}
                      >
                        {room.name.split(' ').slice(0, 2).join(' ')}
                      </text>
                      {isCurrent && (
                        <circle 
                          cx={room.x * 80} cy={room.y * 80} r="4" 
                          fill="#fff"
                        >
                          <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite" />
                        </circle>
                      )}
                    </g>
                  );
                })}
             </svg>
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
