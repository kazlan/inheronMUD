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
  execute: (engine: GameEngine, casterId: string, targetId?: string) => SkillResult;
}

export class SkillManager {
  private skills: Map<string, SkillDef> = new Map();

  constructor() {
    this.registerBaseSkills();
  }

  private registerBaseSkills() {
    // Caballero del Alba
    this.skills.set('tajo_juramentado', {
      id: 'tajo_juramentado',
      name: 'Tajo Juramentado',
      description: 'Un ataque frontal potente cargado de convicción.',
      energyCost: 10,
      cooldown: 0,
      type: 'damage',
      execute: (engine, casterId, targetId) => {
        const combat = engine.getCombatByPlayerId(casterId);
        if (!combat) return { success: false, message: 'Debes estar en combate para usar esto.' };
        
        const caster = combat.participants.find(p => p.entityId === casterId);
        const target = combat.participants.find(p => targetId ? p.entityId === targetId || p.name.toLowerCase().includes(targetId) : !p.isPlayer);
        
        if (!caster || !target) return { success: false, message: 'Objetivo inválido.' };
        if ((caster.energyCurrent || 0) < 10) return { success: false, message: 'No tienes suficiente energía.' };
        
        caster.energyCurrent = (caster.energyCurrent || 10) - 10;
        const dmg = 15; // Base dmg
        target.hpCurrent -= dmg;
        
        return { 
          success: true, 
          message: 'Has usado Tajo Juramentado.',
          combatLog: [`<cyan>${caster.name}</cyan> utiliza <yellow>Tajo Juramentado</yellow> sobre <red>${target.name}</red> por ${dmg} de daño.`]
        };
      }
    });

    // Monje de Candaluz
    this.skills.set('palma_serena', {
      id: 'palma_serena',
      name: 'Palma Serena',
      description: 'Un golpe rápido y preciso al pecho del oponente.',
      energyCost: 5,
      cooldown: 0,
      type: 'damage',
      execute: (engine, casterId, targetId) => {
        const combat = engine.getCombatByPlayerId(casterId);
        if (!combat) return { success: false, message: 'Debes estar en combate.' };
        
        const caster = combat.participants.find(p => p.entityId === casterId);
        const target = combat.participants.find(p => targetId ? p.entityId === targetId || p.name.toLowerCase().includes(targetId) : !p.isPlayer);
        
        if (!caster || !target) return { success: false, message: 'Objetivo inválido.' };
        if ((caster.energyCurrent || 0) < 5) return { success: false, message: 'Energía insuficiente.' };
        
        caster.energyCurrent = (caster.energyCurrent || 5) - 5;
        const dmg = 10;
        target.hpCurrent -= dmg;
        
        return { 
          success: true, 
          message: 'Has usado Palma Serena.',
          combatLog: [`<cyan>${caster.name}</cyan> golpea con <yellow>Palma Serena</yellow> a <red>${target.name}</red> causando ${dmg} de daño.`]
        };
      }
    });

    // Clérigo del Sol Quieto
    this.skills.set('curacion_radiante', {
      id: 'curacion_radiante',
      name: 'Curación Radiante',
      description: 'Sana las heridas de un aliado.',
      energyCost: 15,
      cooldown: 0,
      type: 'heal',
      execute: (engine, casterId, targetId) => {
        const combat = engine.getCombatByPlayerId(casterId);
        const caster = engine.entities.getPlayer(casterId);
        if (!caster) return { success: false, message: 'Jugador inválido.' };

        if ((caster.energyCurrent || 0) < 15) return { success: false, message: 'Energía insuficiente.' };
        caster.energyCurrent = (caster.energyCurrent || 15) - 15;

        const healAmount = 25;

        if (combat) {
            const combatCaster = combat.participants.find(p => p.entityId === casterId);
            if(combatCaster) combatCaster.energyCurrent = caster.energyCurrent;
            const combatTarget = combat.participants.find(p => targetId ? p.entityId === targetId || p.name.toLowerCase().includes(targetId) : p.entityId === casterId);
            
            if (combatTarget) {
                combatTarget.hpCurrent = Math.min((combatTarget.hpCurrent || 0) + healAmount, combatTarget.hpMax || 100);
                return { 
                  success: true, 
                  message: 'Has usado Curación Radiante.',
                  combatLog: [`<cyan>${caster.name}</cyan> invoca <yellow>Curación Radiante</yellow> sobre <green>${combatTarget.name}</green> sanando ${healAmount} HP.`]
                };
            }
        } else {
            caster.hpCurrent = Math.min((caster.hpCurrent || 0) + healAmount, 100); // simplify max hp 100
        }

        return { success: true, message: `Te has curado ${healAmount} HP con Curación Radiante.` };
      }
    });
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
