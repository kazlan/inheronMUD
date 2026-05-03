import { Entity } from './entity.model';

export interface Stats {
  fuerza: number;
  destreza: number;
  constitucion: number;
  ingenio: number;
  sabiduria: number;
  presencia: number;
  percepcion: number;
}

export class Player extends Entity {
  public accountId: string;
  public level: number = 1;
  public experience: number = 0;
  public stats: Stats;
  public roomId: string;
  public inventory: string[] = []; // Item IDs
  public equipment: Record<string, string> = {}; // equipSlot -> itemId
  public classId: string;
  public raceId: string;
  public hpCurrent?: number;
  public energyCurrent?: number;
  public coins: number = 0;

  constructor(
    accountId: string,
    name: string,
    stats: Stats,
    classId: string,
    raceId: string,
    roomId: string,
    id?: string
  ) {
    super(name, '', id);
    this.accountId = accountId;
    this.stats = stats;
    this.classId = classId;
    this.raceId = raceId;
    this.roomId = roomId;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      accountId: this.accountId,
      level: this.level,
      experience: this.experience,
      hpCurrent: this.hpCurrent,
      energyCurrent: this.energyCurrent,
      stats: this.stats,
      roomId: this.roomId,
      inventory: this.inventory,
      equipment: this.equipment,
      classId: this.classId,
      raceId: this.raceId,
      coins: this.coins
    };
  }

  public getXpToNextLevel(): number {
    return this.level * 100;
  }

  public addExperience(amount: number): string[] {
    const logs: string[] = [];
    this.experience += amount;
    logs.push(`<yellow>Has ganado ${amount} puntos de experiencia.</yellow>`);

    while (this.experience >= this.getXpToNextLevel()) {
      this.experience -= this.getXpToNextLevel();
      this.level++;
      
      this.hpCurrent = 50 + (this.stats.constitucion * 10) + (this.level * 5);
      this.energyCurrent = 20 + (this.stats.ingenio * 5) + (this.level * 2);

      if (this.level % 5 === 0) {
         this.stats.fuerza++;
         this.stats.destreza++;
         this.stats.constitucion++;
         this.stats.ingenio++;
         this.stats.sabiduria++;
         this.stats.presencia++;
         this.stats.percepcion++;
      }

      logs.push(`<magenta><b>¡HAS SUBIDO DE NIVEL!</b></magenta> Ahora eres nivel ${this.level}.`);
      logs.push(`<green>Tu vida y energía se han restaurado y tu máximo ha aumentado.</green>`);
    }

    return logs;
  }
}
