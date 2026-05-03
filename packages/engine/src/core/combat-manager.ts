import { v4 as uuidv4 } from 'uuid';

export interface CombatParticipant {
  entityId: string;
  name: string;
  iniciativa: number;
  isPlayer: boolean;
  hpCurrent: number;
  hpMax: number;
  energyCurrent: number;
  energyMax: number;
  resources: Record<string, number>;
  equipment?: Record<string, any>;
}

export interface CombatRound {
  number: number;
  actions: any[];
}

export class CombatManager {
  public readonly id: string;
  public participants: CombatParticipant[] = [];
  public currentRound: number = 0;
  public active: boolean = true;

  constructor(participants: CombatParticipant[]) {
    this.id = uuidv4();
    this.participants = this.sortParticipants(participants);
  }

  private sortParticipants(participants: CombatParticipant[]): CombatParticipant[] {
    // Sort by initiative descending
    return [...participants].sort((a, b) => b.iniciativa - a.iniciativa);
  }

  processRound(): string[] {
    if (!this.active) return [];
    
    this.currentRound++;
    const log: string[] = [`\n<gray>--- Ronda ${this.currentRound} ---</gray>`];

    for (const participant of this.participants) {
      if (!this.active) break;
      if (participant.hpCurrent <= 0) continue;

      const targetEntity = this.participants.find(p => p.isPlayer !== participant.isPlayer && p.hpCurrent > 0);
      if (!targetEntity) {
        this.active = false;
        break;
      }

      // Evasion check (15% chance baseline)
      const evadeChance = 0.15;
      const isEvaded = Math.random() < evadeChance;

      if (isEvaded) {
        if (Math.random() > 0.5) {
          log.push(`¡<cyan>${targetEntity.name}</cyan> esquiva ágilmente el ataque de ${participant.name}!`);
        } else {
          log.push(`¡<blue>${targetEntity.name}</blue> desvía (parry) el golpe de ${participant.name} en el último segundo!`);
        }
        continue;
      }

      // Critical Hit check (10% chance)
      const isCrit = Math.random() < 0.10;

      // Base damage is 3-7
      let baseDamage = Math.floor(Math.random() * 5) + 3;
      
      // Add weapon damage if player has a weapon equipped
      let weaponName = "";
      if (participant.isPlayer && participant.equipment && participant.equipment['weapon']) {
        const weapon = participant.equipment['weapon'];
        if (weapon.metadata && weapon.metadata.damage) {
          baseDamage += weapon.metadata.damage;
        }
        weaponName = weapon.name;
      }

      const damage = isCrit ? baseDamage * 2 : baseDamage;
      
      targetEntity.hpCurrent -= damage;
      
      // Flavor text generator
      let attackDesc = "";
      if (participant.isPlayer) {
        const verb = ["taja", "golpea", "ensarta", "impacta"][Math.floor(Math.random() * 4)];
        const targetPart = ["el pecho", "el flanco", "la cabeza", "una pierna"][Math.floor(Math.random() * 4)];
        const withWeapon = weaponName ? ` con su <magenta>${weaponName}</magenta>` : '';
        attackDesc = `${participant.name} <yellow>${verb}</yellow> a ${targetEntity.name} en ${targetPart}${withWeapon}`;
      } else {
        const verb = ["muerde", "araña", "embiste", "golpea salvajemente"][Math.floor(Math.random() * 4)];
        attackDesc = `${participant.name} <red>${verb}</red> a ${targetEntity.name}`;
      }

      if (isCrit) {
        log.push(`<b>¡GOLPE CRÍTICO!</b> ${attackDesc}, infligiendo <red><b>${damage} de daño brutal</b></red>.`);
      } else {
        log.push(`${attackDesc} por <red>${damage} de daño</red>.`);
      }

      if (targetEntity.hpCurrent <= 0) {
        log.push(`<b>¡${targetEntity.name} se desploma sin vida!</b>`);
      }
    }

    // Check if one side is entirely dead
    const playersAlive = this.participants.some(p => p.isPlayer && p.hpCurrent > 0);
    const enemiesAlive = this.participants.some(p => !p.isPlayer && p.hpCurrent > 0);

    if (!playersAlive) {
      log.push(`\n<red><b>Has sido derrotado...</b></red>`);
      this.active = false;
    } else if (!enemiesAlive) {
      log.push(`\n<yellow><b>¡Has vencido!</b></yellow>`);
      this.active = false;
    }

    return log;
  }

  getParticipantTurnOrder(): CombatParticipant[] {
    return this.participants;
  }

  removeParticipant(entityId: string): void {
    this.participants = this.participants.filter(p => p.entityId !== entityId);
    if (this.participants.filter(p => p.isPlayer).length === 0) {
      this.active = false;
    }
  }
}
