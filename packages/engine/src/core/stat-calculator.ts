import { Stats, Player } from '../models/player.model';

export interface DerivedStats {
  hpMax: number;
  hpCurrent: number;
  energyMax: number;
  energyCurrent: number;
  iniciativa: number;
  evasion: number;
}

export class StatCalculator {
  static calculate(entity: any): DerivedStats {
    const stats = entity.stats;
    const level = entity.level || 1;

    // HP: Base 50 + (Constitución * 10) + (Nivel * 5)
    const hpMax = 50 + (stats.constitucion * 10) + (level * 5);

    // Energía o Recurso de Clase
    let energyMax = 20 + (stats.ingenio * 5) + (level * 2);
    if (entity.classId === 'bardo_cronica_viva') {
      energyMax = 100 + (stats.presencia * 5); // Voz Máxima
    }

    // Iniciativa: Destreza + Percepción
    const iniciativa = stats.destreza + stats.percepcion;

    // Evasión: Destreza + Percepción / 2
    const evasion = Math.floor((stats.destreza + stats.percepcion) / 2);

    return {
      hpMax,
      hpCurrent: entity.hpCurrent !== undefined ? entity.hpCurrent : hpMax,
      energyMax,
      energyCurrent: entity.energyCurrent !== undefined ? entity.energyCurrent : energyMax,
      iniciativa,
      evasion
    };
  }
}
