import { Player } from '../models/player.model';
import { Room } from '../models/room.model';
import { NPC } from '../models/npc.model';
import { Item } from '../models/item.model';
import { Spawner } from '../models/spawner.model';

export class EntityManager {
  public players: Map<string, Player> = new Map();
  public rooms: Map<string, Room> = new Map();
  public npcs: Map<string, NPC> = new Map();
  public npcTemplates: Map<string, any> = new Map();
  public itemTemplates: Map<string, any> = new Map();
  public items: Map<string, Item> = new Map();
  public spawners: Map<string, Spawner> = new Map();

  registerRoom(room: Room): void {
    this.rooms.set(room.id, room);
  }

  registerPlayer(player: Player): void {
    this.players.set(player.id, player);
  }

  registerNPC(npc: NPC): void {
    this.npcs.set(npc.id, npc);
  }

  registerNPCTemplate(id: string, data: any): void {
    this.npcTemplates.set(id, data);
  }

  registerItem(item: Item): void {
    this.items.set(item.id, item);
  }

  registerSpawner(spawner: Spawner): void {
    this.spawners.set(spawner.id, spawner);
  }

  getRoom(id: string): Room | undefined {
    return this.rooms.get(id);
  }

  getPlayer(id: string): Player | undefined {
    return this.players.get(id);
  }

  getNPC(id: string): NPC | undefined {
    return this.npcs.get(id);
  }

  getItem(id: string): Item | undefined {
    return this.items.get(id);
  }

  getSpawner(id: string): Spawner | undefined {
    return this.spawners.get(id);
  }

  removeNPC(id: string): void {
    this.npcs.delete(id);
  }

  applyEffect(entityId: string, effect: any): void {
    const entity = this.players.get(entityId) || this.npcs.get(entityId) || this.rooms.get(entityId) || this.items.get(entityId);
    if (entity) {
      const effectCopy = { ...effect, startTime: Date.now(), id: effect.id || `eff_${Date.now()}_${Math.random()}` };
      entity.activeEffects.push(effectCopy);
    }
  }

  getPlayers(): Player[] {
    return Array.from(this.players.values());
  }

  getNPCsInRoom(roomId: string): NPC[] {
    return Array.from(this.npcs.values()).filter(npc => npc.roomId === roomId);
  }

  removeItem(id: string): void {
    this.items.delete(id);
  }

  movePlayer(playerId: string, targetRoomId: string): void {
    const player = this.players.get(playerId);
    if (!player) return;

    const oldRoom = this.rooms.get(player.roomId);
    if (oldRoom) oldRoom.removeEntity(playerId);

    player.roomId = targetRoomId;
    const newRoom = this.rooms.get(targetRoomId);
    if (newRoom) newRoom.addEntity(playerId);
  }

  moveNPC(npcId: string, targetRoomId: string): void {
    const npc = this.npcs.get(npcId);
    if (!npc) return;

    const oldRoom = this.rooms.get(npc.roomId);
    if (oldRoom) oldRoom.removeEntity(npcId);

    npc.roomId = targetRoomId;
    const newRoom = this.rooms.get(targetRoomId);
    if (newRoom) newRoom.addEntity(npcId);
  }
}
