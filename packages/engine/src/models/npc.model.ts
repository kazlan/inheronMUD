import { Entity } from './entity.model';
import { Stats } from './player.model';

export class NPC extends Entity {
  public stats: Stats;
  public roomId: string;
  public inventory: string[] = [];
  public equipment: Record<string, string> = {};
  public behaviorId: string; // Strategy pattern ID for AI
  public level: number = 1;
  public flags: string[] = []; // wandering, patrol, cobarde, agresivo, social
  public aiState: Record<string, any> = {}; // internal state for patrol routes, etc.
  public metadata: Record<string, any> = {};
  public enemies: string[] = [];
  public areaId?: string;

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

  public getXpReward(): number {
    return this.level * 25 + (this.stats.fuerza + this.stats.constitucion) * 2;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      stats: this.stats,
      roomId: this.roomId,
      inventory: this.inventory,
      behaviorId: this.behaviorId,
      level: this.level,
      flags: this.flags,
      metadata: this.metadata,
      areaId: this.areaId
    };
  }
}
