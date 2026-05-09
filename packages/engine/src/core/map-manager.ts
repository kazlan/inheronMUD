import { GameEngine } from './game-engine';
import { Room } from '../models/room.model';

export interface RoomCoord {
  id: string;
  x: number;
  y: number;
  areaId: string;
  isShop: boolean;
  name: string;
  exits: { direction: string; targetRoomId: string }[];
}

export class MapManager {
  private areaMaps: Map<string, Record<string, RoomCoord>> = new Map();

  constructor(private engine: GameEngine) {}

  public getAreaMap(areaId: string): Record<string, RoomCoord> {
    if (this.areaMaps.has(areaId)) {
      return this.areaMaps.get(areaId)!;
    }

    const map = this.generateAreaMap(areaId);
    this.areaMaps.set(areaId, map);
    return map;
  }

  public clearCache() {
    this.areaMaps.clear();
  }

  private generateAreaMap(areaId: string): Record<string, RoomCoord> {
    const rooms = Array.from(this.engine.entities.rooms.values()).filter(r => r.areaId === areaId);
    if (rooms.length === 0) return {};

    const coords: Record<string, RoomCoord> = {};
    const visited = new Set<string>();

    let unmappedRooms = rooms.filter(r => !visited.has(r.id));
    let clusterOffset = 0;

    while (unmappedRooms.length > 0) {
      const queue: { roomId: string; x: number; y: number }[] = [];
      const startRoom = unmappedRooms[0];
      queue.push({ roomId: startRoom.id, x: clusterOffset, y: 0 });

      while (queue.length > 0) {
        const { roomId, x, y } = queue.shift()!;
        if (visited.has(roomId)) continue;
        visited.add(roomId);

        const room = this.engine.entities.getRoom(roomId);
        if (!room) continue;

        const isShop = this.checkIsShop(room);

        coords[roomId] = {
          id: roomId,
          x,
          y,
          areaId,
          isShop,
          name: room.name,
          exits: room.exits.map(e => ({ direction: e.direction, targetRoomId: e.targetRoomId }))
        };

        // Process exits
        for (const exit of room.exits) {
          const targetRoom = this.engine.entities.getRoom(exit.targetRoomId);
          if (targetRoom && targetRoom.areaId === areaId && !visited.has(targetRoom.id)) {
            const nextCoord = this.getNextCoord(x, y, exit.direction);
            if (nextCoord) {
              queue.push({ roomId: targetRoom.id, x: nextCoord.x, y: nextCoord.y });
            }
          }
        }
      }

      clusterOffset += 10; // offset the next disconnected cluster far away
      unmappedRooms = rooms.filter(r => !visited.has(r.id));
    }

    return coords;
  }

  private checkIsShop(room: Room): boolean {
    const npcs = this.engine.entities.getNPCsInRoom(room.id);
    return npcs.some(npc => {
      return npc.metadata?.merchant || npc.name.toLowerCase().includes('vendedor') || npc.name.toLowerCase().includes('mercader');
    });
  }

  private getNextCoord(x: number, y: number, direction: string): { x: number; y: number } | null {
    const dir = direction.toLowerCase();
    if (['north', 'norte', 'n'].includes(dir)) return { x, y: y - 1 };
    if (['south', 'sur', 's'].includes(dir)) return { x, y: y + 1 };
    if (['east', 'este', 'e'].includes(dir)) return { x: x + 1, y };
    if (['west', 'oeste', 'w', 'o'].includes(dir)) return { x: x - 1, y };
    if (['northeast', 'noreste', 'ne'].includes(dir)) return { x: x + 1, y: y - 1 };
    if (['northwest', 'noroeste', 'nw', 'no'].includes(dir)) return { x: x - 1, y: y - 1 };
    if (['southeast', 'sureste', 'se'].includes(dir)) return { x: x + 1, y: y + 1 };
    if (['southwest', 'suroeste', 'sw', 'so'].includes(dir)) return { x: x - 1, y: y + 1 };
    
    // For vertical movement, offset slightly to show stacking without breaking grid too much
    if (['up', 'arriba', 'u'].includes(dir)) return { x: x + 0.2, y: y - 0.2 };
    if (['down', 'abajo', 'd'].includes(dir)) return { x: x - 0.2, y: y + 0.2 };
    
    return null;
  }
}
