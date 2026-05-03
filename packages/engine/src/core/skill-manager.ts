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

    let target = combat?.participants.find(p => targetId ? p.entityId === targetId || p.name.toLowerCase().includes(targetId) : (skill.type === 'heal' ? p.entityId === casterId : !p.isPlayer));

    const combatLog: string[] = [];

    // Process effects
    if (skill.effects) {
      for (const effect of skill.effects) {
        
        let amount = 0;
        if (effect.diceCount && effect.diceSides) {
          for (let i = 0; i < effect.diceCount; i++) {
            amount += Math.floor(Math.random() * effect.diceSides) + 1;
          }
        } else if (effect.amount) {
          amount = effect.amount;
        }
        
        if (effect.modifier) amount += effect.modifier;

        if (effect.type === 'damage') {
          if (!combat) return { success: false, message: 'Debes estar en combate para atacar.' };
          if (!target) return { success: false, message: 'Objetivo inválido.' };
          
          target.hpCurrent -= amount;
          combatLog.push(`<cyan>${caster.name}</cyan> utiliza <yellow>${skill.name}</yellow> sobre <red>${target.name}</red> por ${amount} de daño.`);
        } else if (effect.type === 'heal') {
          if (combat) {
            if (!target) target = combatCaster; // Self heal fallback
            if (target) {
              target.hpCurrent = Math.min((target.hpCurrent || 0) + amount, target.hpMax || 100);
              combatLog.push(`<cyan>${caster.name}</cyan> invoca <yellow>${skill.name}</yellow> sobre <green>${target.name}</green> sanando ${amount} HP.`);
            }
          } else {
            caster.hpCurrent = Math.min((caster.hpCurrent || 0) + amount, 100);
            return { success: true, message: `Te has curado ${amount} HP con ${skill.name}.` };
          }
        }
      }
    }

    if (combatLog.length === 0) {
      combatLog.push(`<cyan>${caster.name}</cyan> utiliza <yellow>${skill.name}</yellow>.`);
    }

    return { 
      success: true, 
      message: `Has usado ${skill.name}.`,
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
