import { GameEngine } from './game-engine';
import { Player } from '../models/player.model';

export interface SkillRecommendation {
  skillId: string;
  name: string;
  score: number;
  reason: string;
  type: string;
  family?: string;
}

export class ReactiveSkillService {
  constructor(private engine: GameEngine) {}

  /**
   * Generates a list of recommended skills (Pulso de Combate)
   * based on the current context of the player and their combat state.
   */
  public getRecommendations(playerId: string, limit: number = 6): SkillRecommendation[] {
    const player = this.engine.entities.getPlayer(playerId);
    if (!player) return [];

    const combat = this.engine.getCombatByPlayerId(playerId);
    if (!combat) return [];

    const recommendations: SkillRecommendation[] = [];
    const availableSkills = player.metadata?.skills || [];

    for (const skillId of availableSkills) {
      const skill = this.engine.skills.getSkill(skillId);
      if (!skill) continue;

      let score = 0;
      let reason = '';

      // Simple scoring logic based on skill type and current state
      if (skill.type === 'heal') {
        const hpPercent = (player.hpCurrent || 0) / (player.hpMax || 100);
        if (hpPercent < 0.3) {
          score += 100;
          reason = 'Salud crítica, sanación urgente';
        } else if (hpPercent < 0.6) {
          score += 50;
          reason = 'Salud baja, buena oportunidad de sanación';
        }
      } else if (skill.type === 'damage') {
        score += 20;
        reason = 'Ataque estándar';
        
        // Bardo combo context
        if (player.classId === 'bardo_cronica_viva' && player.bardState) {
          if (skillId === 'bardo_nota_cortante') {
            score += 30;
            reason = 'Apertura de combate';
          } else if (skillId === 'bardo_copla_pegadiza') {
            if (player.bardState.lastFamilyUsed === 'nota') {
               score += 50;
               reason = 'Armonía de combo lista';
            }
          }
        }
      } else if (skill.type === 'buff') {
        score += 30;
        reason = 'Mejora táctica';
      } else if (skill.type === 'utility') {
         if (skillId === 'bardo_sostener_compas' && player.bardState?.freeSustainAvailable) {
            score += 80;
            reason = 'Sostener Compás gratuito disponible';
         } else {
            score += 10;
            reason = 'Utilidad situacional';
         }
      }

      // Base cooldown or cost checks could reduce score or disqualify
      if ((player.energyCurrent || 0) < skill.energyCost) {
        score = -1; // Cannot afford
      }

      if (score >= 0) {
        recommendations.push({
          skillId: skill.id,
          name: skill.name,
          score,
          reason,
          type: skill.type,
          family: skill.family
        });
      }
    }

    return recommendations.sort((a, b) => b.score - a.score).slice(0, limit);
  }
}
