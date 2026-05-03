import { Player } from '../models/player.model';
import { Room } from '../models/room.model';
import { NPC } from '../models/npc.model';
import { Item } from '../models/item.model';

export class EntityManager {
  public players: Map<string, Player> = new Map();
  public rooms: Map<string, Room> = new Map();
  public npcs: Map<string, NPC> = new Map();
  public items: Map<string, Item> = new Map();

  registerRoom(room: Room): void {
    this.rooms.set(room.id, room);
  }

  registerPlayer(player: Player): void {
    this.players.set(player.id, player);
  }

  registerNPC(npc: NPC): void {
    this.npcs.set(npc.id, npc);
  }

  registerItem(item: Item): void {
    this.items.set(item.id, item);
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
}
