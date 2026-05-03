import { Entity } from './entity.model';
import { Stats } from './player.model';

export class NPC extends Entity {
  public stats: Stats;
  public roomId: string;
  public inventory: string[] = [];
  public behaviorId: string; // Strategy pattern ID for AI
  public level: number = 1;

  constructor(
    name: string,
    description: string,
    stats: Stats,
    behaviorId: string,
    roomId: string,
    id?: string
  ) {
    super(name, description, id);
    this.stats = stats;
    this.behaviorId = behaviorId;
    this.roomId = roomId;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      stats: this.stats,
      roomId: this.roomId,
      inventory: this.inventory,
      behaviorId: this.behaviorId,
      level: this.level
    };
  }
}
