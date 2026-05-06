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
    const queue: { roomId: string; x: number; y: number }[] = [];

    // Start with the first room at 0,0
    const startRoom = rooms[0];
    queue.push({ roomId: startRoom.id, x: 0, y: 0 });

    const visited = new Set<string>();

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

    return coords;
  }

  private checkIsShop(room: Room): boolean {
    const npcs = this.engine.entities.getNPCsInRoom(room.id);
    return npcs.some(npc => {
      const behaviors = (npc as any).behaviors || {};
      return behaviors.shop || behaviors.vendor || npc.name.toLowerCase().includes('vendedor') || npc.name.toLowerCase().includes('mercader');
    });
  }

  private getNextCoord(x: number, y: number, direction: string): { x: number; y: number } | null {
    const dir = direction.toLowerCase();
    if (dir === 'north' || dir === 'norte') return { x, y: y - 1 };
    if (dir === 'south' || dir === 'sur') return { x, y: y + 1 };
    if (dir === 'east' || dir === 'este') return { x, y: x + 1 };
    if (dir === 'west' || dir === 'oeste') return { x, y: x - 1 };
    if (dir === 'northeast' || dir === 'noreste') return { x: x + 1, y: y - 1 };
    if (dir === 'northwest' || dir === 'noroeste') return { x: x - 1, y: y - 1 };
    if (dir === 'southeast' || dir === 'sureste') return { x: x + 1, y: y + 1 };
    if (dir === 'southwest' || dir === 'suroeste') return { x: x - 1, y: y + 1 };
    return null;
  }
}
