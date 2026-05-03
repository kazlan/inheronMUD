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

  removeItem(id: string): void {
    this.items.delete(id);
  }
}
