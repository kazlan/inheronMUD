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
  flags?: string[];
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

  constructor(
    participants: CombatParticipant[],
    private onAction?: (actorId: string, actionType: string, magnitude: number) => void
  ) {
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
    const log: string[] = [];

    for (const participant of this.participants) {
      if (!this.active) break;
      if (participant.hpCurrent <= 0) continue;
      if ((participant as any).hasFled) continue;

      if (!participant.isPlayer && participant.flags?.includes('cobarde')) {
        if (participant.hpCurrent / participant.hpMax < 0.3) {
          log.push(`¡<yellow>${participant.name}</yellow> entra en pánico y huye despavorido del combate!`);
          (participant as any).hasFled = true;
          continue;
        }
      }

      const targetEntity = this.participants.find(p => p.isPlayer !== participant.isPlayer && p.hpCurrent > 0 && !(p as any).hasFled);
      if (!targetEntity) {
        this.active = false;
        break;
      }

      // Evasion check (15% chance baseline)
      let evadeChance = 0.15;
      if (targetEntity.isPlayer) {
         const hasVanguardia = this.participants.some(p => p.isPlayer && (p as any)._armoniaVanguardiaActive);
         if (hasVanguardia) evadeChance += 0.10;
      }

      const isEvaded = Math.random() < evadeChance;

      if (isEvaded) {
        if (Math.random() > 0.5) {
          log.push(`¡<cyan>${targetEntity.name}</cyan> esquiva ágilmente el ataque de ${participant.name}!`);
        } else {
          log.push(`¡<blue>${targetEntity.name}</blue> desvía (parry) el golpe de ${participant.name} en el último segundo!`);
        }

        if ((participant as any)._armoniaRidiculoActive && (participant as any)._bardEntityId) {
           log.push(`🎭 El fallo de ${participant.name} resuena con la síncopa. Su ritmo se quiebra.`);
           if (this.onAction) {
             this.onAction((participant as any)._bardEntityId, 'armonia_ridiculo_evade', Math.random() < 0.2 ? 1 : 0);
           }
        }

        continue;
      }

      // Critical Hit check (10% chance)
      const isCrit = Math.random() < 0.10;

      // Base unarmed damage is 1d4 + 1
      let diceCount = 1;
      let diceSides = 4;
      let modifier = 1;
      
      // Add weapon damage if participant has a weapon equipped
      let weaponName = "";
      if (participant.equipment && participant.equipment['weapon']) {
        const weapon = participant.equipment['weapon'];
        if (weapon.metadata) {
          if (weapon.metadata.diceCount !== undefined) diceCount = weapon.metadata.diceCount;
          if (weapon.metadata.diceSides !== undefined) diceSides = weapon.metadata.diceSides;
          if (weapon.metadata.modifier !== undefined) modifier = weapon.metadata.modifier;
        }
        weaponName = weapon.name;
      }

      // Roll the dice!
      let baseDamage = modifier;
      for (let i = 0; i < diceCount; i++) {
        baseDamage += Math.floor(Math.random() * diceSides) + 1;
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
        if (participant.isPlayer && this.onAction) {
          this.onAction(participant.entityId, 'critical_hit', damage);
        }
      } else {
        log.push(`${attackDesc} por <red>${damage} de daño</red>.`);
      }

      if (targetEntity.hpCurrent <= 0) {
        log.push(`<b>¡${targetEntity.name} se desploma sin vida!</b>`);
        if (participant.isPlayer && this.onAction) {
          this.onAction(participant.entityId, 'killing_blow', damage);
        }
      }
    }

    // Cleanup fled participants
    this.participants = this.participants.filter(p => !(p as any).hasFled);

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
