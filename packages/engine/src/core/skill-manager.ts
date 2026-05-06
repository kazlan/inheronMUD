import { GameEngine } from './game-engine';

export interface SkillResult {
  success: boolean;
  message: string;
  combatLog?: string[];
}

export interface SkillDef {
  id: string;
  name: string;
  description: string;
  energyCost: number;
  cooldown: number; // rounds or ms
  type: 'damage' | 'heal' | 'buff' | 'utility';
  family?: string;
  effects?: any[];
  execute: (engine: GameEngine, casterId: string, targetId?: string) => SkillResult;
}

export class SkillManager {
  private skills: Map<string, SkillDef> = new Map();

  constructor() {
    // Loaded later by GameEngine / WorldFactory
  }

  public loadFromData(skillsData: any[]) {
    this.skills.clear();
    for (const data of skillsData) {
      const skillDef: SkillDef = {
        id: data.id,
        name: data.name,
        description: data.description,
        energyCost: data.energyCost || 0,
        cooldown: data.cooldown || 0,
        type: data.type || 'utility',
        family: data.family,
        effects: data.effects || [],
        execute: (engine, casterId, targetId) => this.executeSkill(data.id, engine, casterId, targetId)
      };
      this.skills.set(data.id, skillDef);
    }
  }

  private executeSkill(skillId: string, engine: GameEngine, casterId: string, targetId?: string): SkillResult {
    const skill = this.skills.get(skillId);
    if (!skill) return { success: false, message: 'Habilidad desconocida.' };

    const combat = engine.getCombatByPlayerId(casterId);
    const caster = engine.entities.getPlayer(casterId);
    if (!caster) return { success: false, message: 'Jugador inválido.' };

    if ((caster.energyCurrent || 0) < skill.energyCost) {
      return { success: false, message: 'Energía insuficiente.' };
    }

    caster.energyCurrent = (caster.energyCurrent || 0) - skill.energyCost;

    let combatCaster = combat?.participants.find(p => p.entityId === casterId);
    if (combatCaster) combatCaster.energyCurrent = caster.energyCurrent;

    let targetEntityId: string | undefined;
    let targetEntityName: string | undefined;
    let targetHpCurrent: number | undefined;
    let targetHpMax: number | undefined;
    let isTargetPlayer = false;

    // Resolve Target
    if (combat) {
      const pTarget = combat.participants.find(p => targetId ? p.entityId === targetId || p.name.toLowerCase().startsWith(targetId.toLowerCase()) : (skill.type === 'heal' || skill.type === 'utility' ? p.entityId === casterId : !p.isPlayer));
      if (pTarget) {
        targetEntityId = pTarget.entityId;
        targetEntityName = pTarget.name;
        targetHpCurrent = pTarget.hpCurrent;
        targetHpMax = pTarget.hpMax;
        isTargetPlayer = pTarget.isPlayer;
      }
    } else {
      // Out of combat target resolution
      const room = engine.entities.getRoom(caster.roomId);
      if (room) {
        if (!targetId && (skill.type === 'heal' || skill.type === 'utility')) {
          targetEntityId = caster.id;
          targetEntityName = caster.name;
          targetHpCurrent = caster.hpCurrent;
          targetHpMax = caster.hpMax || 100;
          isTargetPlayer = true;
        } else if (targetId) {
          // Look for NPC
          const npcId = room.entities.find(id => {
            const npc = engine.entities.getNPC(id);
            return npc && (npc.id === targetId || npc.name.toLowerCase().startsWith(targetId.toLowerCase()));
          });
          if (npcId) {
            const npc = engine.entities.getNPC(npcId)!;
            targetEntityId = npc.id;
            targetEntityName = npc.name;
            targetHpCurrent = npc.hpCurrent;
            targetHpMax = npc.hpMax || 100;
          } else {
            // Look for Player
            const otherPlayers = engine.getAllPlayers().filter(p => p.roomId === caster.roomId);
            const otherPlayer = otherPlayers.find(p => p.id === targetId || p.name.toLowerCase().startsWith(targetId.toLowerCase()));
            if (otherPlayer) {
              targetEntityId = otherPlayer.id;
              targetEntityName = otherPlayer.name;
              targetHpCurrent = otherPlayer.hpCurrent;
              targetHpMax = otherPlayer.hpMax || 100;
              isTargetPlayer = true;
            }
          }
        }
      }
    }

    // Initiate combat if damage skill used out of combat
    if (!combat && skill.effects?.some(e => e.type === 'damage')) {
      if (!targetEntityId) return { success: false, message: 'Objetivo inválido.' };
      if (isTargetPlayer) return { success: false, message: 'No puedes atacar a otros jugadores (PvP desactivado).' };
      engine.initiateCombat([caster.id], [targetEntityId]);
      combat = engine.getCombatByPlayerId(caster.id);
      combatCaster = combat?.participants.find(p => p.entityId === casterId);
      // Re-fetch target from combat state
      const pTarget = combat?.participants.find(p => p.entityId === targetEntityId);
      if (pTarget) {
        targetHpCurrent = pTarget.hpCurrent;
      }
    }

    const combatLog: string[] = [];

    // Process effects
    if (skill.effects) {
      for (const effect of skill.effects) {
        
        let amount = 0;
        if (effect.diceCount && effect.diceSides) {
          for (let i = 0; i < effect.diceCount; i++) {
            amount += Math.floor(Math.random() * effect.diceSides) + 1;
          }
        }
        if (effect.modifier) amount += effect.modifier;

        if (effect.type === 'damage') {
          if (!targetEntityId) return { success: false, message: 'Objetivo inválido.' };
          
          if (combat) {
            const combatTarget = combat.participants.find(p => p.entityId === targetEntityId);
            if (combatTarget) combatTarget.hpCurrent -= amount;
          } else {
            // Unreachable if combat initiated above, but just in case
            const npcTarget = engine.entities.getNPC(targetEntityId);
            if (npcTarget) npcTarget.hpCurrent -= amount;
          }
          combatLog.push(`<cyan>${caster.name}</cyan> utiliza <yellow>${skill.name}</yellow> sobre <red>${targetEntityName}</red> por ${amount} de daño.`);
          
        } else if (effect.type === 'heal') {
          if (!targetEntityId) {
            targetEntityId = caster.id;
            targetEntityName = caster.name;
          }
          const finalAmount = amount;
          
          if (combat) {
            const combatTarget = combat.participants.find(p => p.entityId === targetEntityId);
            if (combatTarget) {
              combatTarget.hpCurrent = Math.min((combatTarget.hpCurrent || 0) + finalAmount, combatTarget.hpMax || 100);
            }
          }
          
          if (isTargetPlayer) {
            const actualPlayer = engine.entities.getPlayer(targetEntityId);
            if (actualPlayer) {
              actualPlayer.hpCurrent = Math.min((actualPlayer.hpCurrent || 0) + finalAmount, actualPlayer.hpMax || 100);
            }
          } else {
             const actualNpc = engine.entities.getNPC(targetEntityId);
             if (actualNpc) actualNpc.hpCurrent = Math.min((actualNpc.hpCurrent || 0) + finalAmount, actualNpc.hpMax || 100);
          }

          if (combat) {
            combatLog.push(`<cyan>${caster.name}</cyan> invoca <yellow>${skill.name}</yellow> sobre <green>${targetEntityName}</green> sanando ${finalAmount} HP.`);
          } else {
            engine.emit('spatial_message', {
              roomId: caster.roomId,
              message: `<cyan>${caster.name}</cyan> invoca <yellow>${skill.name}</yellow> sobre <green>${targetEntityName}</green>.`
            });
            engine.savePlayer(casterId); // Sync caster
            if (targetEntityId !== casterId && isTargetPlayer) engine.savePlayer(targetEntityId); // Sync target if another player
            return { success: true, message: `Has lanzado ${skill.name} sobre ${targetEntityName}.` };
          }
        } else if (effect.type === 'buff' || effect.type === 'debuff') {
          if (!targetEntityId) {
            targetEntityId = caster.id;
            targetEntityName = caster.name;
          }
          const actualTarget = isTargetPlayer ? engine.entities.getPlayer(targetEntityId) : engine.entities.getNPC(targetEntityId);
          if (actualTarget) {
            if (!actualTarget.activeEffects) actualTarget.activeEffects = [];
            actualTarget.activeEffects.push({
              id: `eff_${skill.id}_${Date.now()}`,
              sourceSkillId: skill.id,
              name: skill.name,
              type: effect.type,
              modifier: effect.modifier,
              startTime: Date.now(),
              duration: effect.duration || 30000 // 30 seconds default
            });
            const color = effect.type === 'buff' ? 'green' : 'red';
            const actionWord = effect.type === 'buff' ? 'potencia' : 'debilita';
            combatLog.push(`<cyan>${caster.name}</cyan> ${actionWord} a <${color}>${targetEntityName}</${color}> con <yellow>${skill.name}</yellow>.`);
          }
        }
      }
    }

    // Hardcoded skill logics for Bard
    if (skillId === 'bardo_sostener_compas') {
      const extensionMs = 15000; // 15 seconds extension
      engine.effects.extendEffects(caster.id, extensionMs);
      if (combat) {
        combat.participants.filter(p => p.isPlayer).forEach(p => engine.effects.extendEffects(p.entityId, extensionMs));
      }
      combatLog.push(`<cyan>${caster.name}</cyan> sostiene el compás, extendiendo los efectos de sus cantos.`);
      
      if (caster.bardState) {
        caster.bardState.freeSustainAvailable = false;
        // Cost was charged, unless it was free, but that logic goes to command parser.
      }
    } else if (skillId === 'bardo_himno_victoria') {
      if (!caster.bardState || (caster.bardState.aplauso || 0) < 3) {
        // Refund energy
        caster.energyCurrent = (caster.energyCurrent || 0) + skill.energyCost;
        if (combatCaster) combatCaster.energyCurrent = caster.energyCurrent;
        return { success: false, message: 'Necesitas 3 Aplausos para entonar el Himno de Victoria.' };
      }
      caster.bardState.aplauso -= 3;
      combatLog.push(`<magenta><b>¡${caster.name} entona el glorioso Himno de Victoria consumiendo 3 Aplausos!</b></magenta>`);
    }

    // Trama logic for Bard
    if (caster.classId === 'bardo_cronica_viva' && caster.bardState && skill.family) {
      if (caster.bardState.lastFamilyUsed === skill.family) {
        caster.bardState.repeatedFamilyCount = (caster.bardState.repeatedFamilyCount || 0) + 1;
      } else {
        caster.bardState.repeatedFamilyCount = 0;
        caster.bardState.lastFamilyUsed = skill.family;
        
        // Changing family increments the "estrofa" (stanza)
        caster.bardState.estrofa = (caster.bardState.estrofa || 0) + 1;
        
        // Check "Trama" thresholds
        if (caster.bardState.estrofa >= 3) {
          caster.bardState.estrofa = 0; // Reset estrofa upon climax
          caster.bardState.freeSustainAvailable = true;
          combatLog.push(`<magenta>La Trama se entrelaza: Has alcanzado el clímax de la estrofa. Tienes un "Sostener Compás" gratuito.</magenta>`);
        } else {
          combatLog.push(`<yellow>Cambias a la melodía de ${skill.family}. Estrofa actual: ${caster.bardState.estrofa}/3.</yellow>`);
        }
      }
    }

    if (combatLog.length === 0) {
      combatLog.push(`<cyan>${caster.name}</cyan> utiliza <yellow>${skill.name}</yellow>.`);
    }

    if (combat && combatLog.length > 0) {
      engine.emit('combat_message', casterId, combatLog);
      return { success: true, message: '' }; // Suppress duplicate message since combat_message handles it
    }

    return { 
      success: true, 
      message: combatLog.join('\n'), // Out of combat, show the log
      combatLog
    };
  }

  getSkill(nameOrId: string): SkillDef | undefined {
    // Try exact ID
    if (this.skills.has(nameOrId)) return this.skills.get(nameOrId);
    
    // Try substring matching name
    const lower = nameOrId.toLowerCase();
    for (const skill of this.skills.values()) {
      if (skill.name.toLowerCase().includes(lower) || skill.id.toLowerCase().includes(lower)) {
        return skill;
      }
    }
    return undefined;
  }

  getAllSkills(): SkillDef[] {
    return Array.from(this.skills.values());
  }
}
