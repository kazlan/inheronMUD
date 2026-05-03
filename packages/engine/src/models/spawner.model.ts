export interface SpawnVariant {
  npcId: string;
  chance: number; // 0 to 100
  unique?: boolean; // Only one instance of this variant can be alive globally from this spawner
}

export class Spawner {
  public id: string;
  public roomId: string;
  public maxActive: number;
  public intervalMs: number;
  public variants: SpawnVariant[];
  
  public lastSpawnTime: number = 0;
  public activeInstances: string[] = [];

  constructor(id: string, roomId: string, maxActive: number, intervalMs: number, variants: SpawnVariant[]) {
    this.id = id;
    this.roomId = roomId;
    this.maxActive = maxActive;
    this.intervalMs = intervalMs;
    this.variants = variants;
  }
}
