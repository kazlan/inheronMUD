import { Player, Stats } from '../models/player.model';
import { RACES, Race } from '../data/races';
import { CLASSES, Class } from '../data/classes';
import { StatCalculator } from './stat-calculator';

export interface CharacterCreationData {
  accountId: string;
  name: string;
  raceId: string;
  classId: string;
  distributedPoints: Partial<Stats>;
  startingRoomId?: string;
  id?: string;
}

export class CharacterCreator {
  private static readonly BASE_STAT_VALUE = 5;
  private static readonly TOTAL_POINTS_TO_DISTRIBUTE = 6;

  static create(data: CharacterCreationData): Player {
    const race = RACES.find(r => r.id === data.raceId);
    const charClass = CLASSES.find(c => c.id === data.classId);

    if (!race || !charClass) {
      throw new Error('Invalid race or class selected.');
    }

    const stats = this.calculateFinalStats(race, charClass, data.distributedPoints);

    const player = new Player(
      data.accountId,
      data.name,
      stats,
      data.classId,
      data.raceId,
      data.startingRoomId || 'villaclara_plaza',
      data.id
    );

    // Apply starting skills (placeholders for now)
    player.metadata.skills = [...charClass.startingSkills];
    player.metadata.racialTrait = race.racialTrait;
    player.metadata.gremioRank = 'COBRE';
    
    // Initialize default prompt settings
    player.metadata.promptSettings = {
      hp: true,
      resource: true,
      trama: true,
      aplauso: true,
      emoji: true
    };

    // Initialize HP and Energy/Voice
    const derived = StatCalculator.calculate(player);
    player.hpMax = derived.hpMax;
    player.hpCurrent = derived.hpMax;
    player.energyMax = derived.energyMax;
    player.energyCurrent = derived.energyMax;

    // Initialize Bard State if applicable
    if (data.classId === 'bardo_cronica_viva' || data.classId === 'bardo_cronica') {
      player.bardState = {
        estrofa: 0,
        aplauso: 0,
        tramaMax: 1
      };
    }

    return player;
  }

  private static calculateFinalStats(
    race: Race,
    charClass: Class,
    distributed: Partial<Stats>
  ): Stats {
    const finalStats: Stats = {
      fuerza: this.BASE_STAT_VALUE,
      destreza: this.BASE_STAT_VALUE,
      constitucion: this.BASE_STAT_VALUE,
      ingenio: this.BASE_STAT_VALUE,
      sabiduria: this.BASE_STAT_VALUE,
      presencia: this.BASE_STAT_VALUE,
      percepcion: this.BASE_STAT_VALUE,
    };

    // Apply race bonuses
    this.applyBonuses(finalStats, race.statBonuses);

    // Apply class bonuses
    this.applyBonuses(finalStats, charClass.statBonuses);

    // Apply distributed points
    // Note: In a real scenario, we'd validate that the sum of distributed points 
    // doesn't exceed TOTAL_POINTS_TO_DISTRIBUTE and no stat > 10.
    this.applyBonuses(finalStats, distributed);

    return finalStats;
  }

  private static applyBonuses(target: Stats, bonuses: Partial<Stats>): void {
    for (const key in bonuses) {
      if (bonuses.hasOwnProperty(key)) {
        (target as any)[key] += (bonuses as any)[key] || 0;
      }
    }
  }
}
