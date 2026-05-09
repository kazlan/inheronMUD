import React from 'react';

interface MinimapProps {
  areaMap: Record<string, any>;
  currentRoomId: string;
  visitedRooms: string[];
  radius?: number;
}

const CELL_SIZE = 16;
const GAP = 10;
const OFFSET = (CELL_SIZE + GAP);

export default function Minimap({ areaMap, currentRoomId, visitedRooms, radius = 4 }: MinimapProps) {
  const currentRoom = areaMap[currentRoomId];
  if (!currentRoom) return <div className="minimap-empty">Explorando...</div>;

  const { x: curX, y: curY } = currentRoom;

  // Filter rooms within radius
  const visibleRooms = Object.values(areaMap).filter(room => {
    return Math.abs(room.x - curX) <= radius && Math.abs(room.y - curY) <= radius;
  });

  const getPos = (x: number, y: number) => {
    const rx = (x - curX) * OFFSET + 110; // Center at 110 (half of 220)
    const ry = (y - curY) * OFFSET + 110;
    return { x: rx, y: ry };
  };

  return (
    <div className="minimap-svg-container" style={{ width: '100%', height: '180px', background: 'rgba(0,0,0,0.4)', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
      <svg width="100%" height="100%" viewBox="0 0 220 220" preserveAspectRatio="xMidYMid slice">
        {/* Connection Lines */}
        {visibleRooms.map(room => {
          const isVisited = visitedRooms.includes(room.id);
          if (!isVisited) return null;

          const start = getPos(room.x, room.y);
          
          return (room.exits || []).map((exit: any, idx: number) => {
            const target = areaMap[exit.targetRoomId];
            if (!target || !visitedRooms.includes(target.id)) return null;
            
            // Only draw within radius
            if (Math.abs(target.x - curX) > radius || Math.abs(target.y - curY) > radius) return null;

            const end = getPos(target.x, target.y);
            
            return (
              <line 
                key={`${room.id}-${idx}`}
                x1={start.x} y1={start.y}
                x2={end.x} y2={end.y}
                stroke="rgba(201, 168, 76, 0.4)"
                strokeWidth="1.5"
              />
            );
          });
        })}

        {/* Room Nodes */}
        {visibleRooms.map(room => {
          const isVisited = visitedRooms.includes(room.id);
          if (!isVisited) return null;

          const isCurrent = room.id === currentRoomId;
          const pos = getPos(room.x, room.y);
          
          let color = 'rgba(201, 168, 76, 0.5)';
          if (isCurrent) color = 'var(--gold)';
          else if (room.isShop) color = 'var(--arcane-purple)';

          return (
            <g key={room.id} title={room.name}>
              <rect 
                x={pos.x - CELL_SIZE/2} 
                y={pos.y - CELL_SIZE/2} 
                width={CELL_SIZE} 
                height={CELL_SIZE}
                fill={color}
                stroke={isCurrent ? '#fff' : 'rgba(255,255,255,0.2)'}
                strokeWidth={isCurrent ? 2 : 1}
                rx="2"
                style={{ filter: isCurrent ? 'drop-shadow(0 0 4px var(--gold))' : 'none' }}
              />
              {isCurrent && (
                <circle 
                  cx={pos.x} cy={pos.y} r="2" 
                  fill="#fff" 
                  className="player-dot-anim"
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
