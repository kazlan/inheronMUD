import { GameEngine } from './game-engine';
import { StatCalculator } from './stat-calculator';


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

  constructor() {}

  public loadFromData(skillsData: any[]) {
    this.skills.clear();
    for (const data of skillsData) {
      const skillDef: SkillDef = {
        ...data,
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

    let combat = engine.getCombatByPlayerId(casterId);
    const caster = engine.entities.getPlayer(casterId);
    if (!caster) return { success: false, message: 'Jugador inválido.' };

    // Ensure energy
    if (caster.energyCurrent === undefined) {
      const derived = StatCalculator.calculate(caster);
      caster.energyCurrent = derived.energyMax;
    }

    const currentEnergy = caster.energyCurrent!;
    let actualEnergyCost = skill.energyCost;

    if (skill.id === 'bardo_sostener_compas' && caster.bardState?.freeSustainAvailable) {
      actualEnergyCost = 0;
    }

    if (currentEnergy < actualEnergyCost) {
      if (caster.classId === 'bardo_cronica_viva') {
        return { success: false, message: '<magenta>La voz no te responde.</magenta> Necesitas un momento para recuperar el aliento.' };
      }
      return { success: false, message: 'Energía insuficiente.' };
    }

    // Cooldown check
    if (!caster.metadata.cooldowns) caster.metadata.cooldowns = {};
    const cdEnd = caster.metadata.cooldowns[skill.id];
    if (cdEnd && Date.now() < cdEnd) {
      const remainingSecs = Math.ceil((cdEnd - Date.now()) / 1000);
      return { success: false, message: `<red>La habilidad ${skill.name} está en recarga (${remainingSecs}s).</red>` };
    }

    let combatCaster = combat?.participants.find(p => p.entityId === casterId);
    let targetEntityId: string | undefined;
    let targetEntityName: string | undefined;
    let isTargetPlayer = false;

    // Resolve Target
    if (combat) {
      const pTarget = combat.participants.find(p => {
        const isBeneficial = skill.type === 'heal' || skill.type === 'utility' || skill.type === 'buff';
        const matches = targetId ? p.entityId === targetId || p.name.toLowerCase().startsWith(targetId.toLowerCase()) : (isBeneficial ? p.entityId === casterId : !p.isPlayer);
        return matches && (p.hpCurrent > 0 || skill.type === 'heal');
      });
      if (pTarget) {
        targetEntityId = pTarget.entityId;
        targetEntityName = pTarget.name;
        isTargetPlayer = pTarget.isPlayer;
      }
    } else {
      const room = engine.entities.getRoom(caster.roomId);
      if (room) {
        const isBeneficial = skill.type === 'heal' || skill.type === 'utility' || skill.type === 'buff';
        if (!targetId && isBeneficial) {
          targetEntityId = caster.id;
          targetEntityName = caster.name;
          isTargetPlayer = true;
        } else if (targetId) {
          const npcId = room.entities.find(id => {
            const npc = engine.entities.getNPC(id);
            return npc && (npc.id === targetId || npc.name.toLowerCase().startsWith(targetId.toLowerCase())) && (npc.hpCurrent ?? 0) > 0;
          });
          if (npcId) {
            targetEntityId = npcId;
            targetEntityName = engine.entities.getNPC(npcId)?.name;
          } else {
            const otherPlayer = engine.entities.getPlayers().find(p => p.roomId === caster.roomId && (p.id === targetId || p.name.toLowerCase().startsWith(targetId.toLowerCase())));
            if (otherPlayer) {
              targetEntityId = otherPlayer.id;
              targetEntityName = otherPlayer.name;
              isTargetPlayer = true;
            }
          }
        }
      }
    }

    // Initiate combat if damage skill used out of combat
    if (!combat && (skill.effects?.some(e => e.type === 'damage') || (skill as any).damageFormula)) {
      if (!targetEntityId) return { success: false, message: 'Objetivo inválido.' };
      if (isTargetPlayer) return { success: false, message: 'No puedes atacar a otros jugadores.' };
      engine.initiateCombat([caster.id], [targetEntityId]);
      combat = engine.getCombatByPlayerId(caster.id);
      combatCaster = combat?.participants.find(p => p.entityId === casterId);
    }

    // Deduct cost
    caster.energyCurrent = (caster.energyCurrent || 0) - actualEnergyCost;
    if (combatCaster) combatCaster.energyCurrent = caster.energyCurrent;

    // Apply cooldown immediately so it's not bypassed by early returns (misses)
    if (skill.cooldown && skill.cooldown > 0) {
      caster.metadata.cooldowns[skill.id] = Date.now() + (skill.cooldown * 2500);
    }

    const combatLog: string[] = [];
    const stats = caster.stats;
    const level = caster.level || 1;

    // 1. Accuracy Check
    const isBeneficial = skill.type === 'heal' || skill.type === 'buff' || skill.type === 'utility';
    let isHit = true;
    let isCrit = false;
    let isFumble = false;

    if (!isBeneficial) {
      const accuracyStat = (skill as any).attributes?.accuracy || 'percepcion';
      const accuracyValue = (stats as any)[accuracyStat] || 10;
      const d20 = Math.floor(Math.random() * 20) + 1;
      const totalAccuracy = d20 + accuracyValue;
      
      let targetEvasion = 10;
      if (targetEntityId) {
        const target = isTargetPlayer ? engine.entities.getPlayer(targetEntityId) : engine.entities.getNPC(targetEntityId);
        if (target) targetEvasion = StatCalculator.calculate(target).evasion;
      }

      isCrit = d20 === 20;
      isFumble = d20 === 1;
      isHit = isCrit || (totalAccuracy >= targetEvasion && !isFumble);
    }

    if (!isHit) {
      combatLog.push(`<cyan>${caster.name}</cyan> intenta lanzar <yellow>${skill.name}</yellow> pero <gray>falla</gray>.`);
      if (isFumble) {
        const pifia = (skill as any).repercussion?.onCriticalFailure;
        if (pifia?.applyToSelf) {
          engine.entities.applyEffect(casterId, { id: pifia.applyToSelf, name: 'Pifia: ' + pifia.applyToSelf, duration: (pifia.duration || 1) * 10000, type: 'debuff' });
          combatLog.push(`<red>¡Fallo Crítico! ${caster.name} sufre de ${pifia.applyToSelf}.</red>`);
        }
      }
      if (combat) {
        const others = combat.participants.filter(p => p.isPlayer && p.entityId !== casterId);
        for (const p of others) engine.emit('combat_message', p.entityId, combatLog);
        engine.emit('combat_message', casterId, []);
      }
      engine.emit('save_player', caster);
      return { success: true, message: combatLog.join('\n') };
    }

    // 2. Process Damage Formula
    if ((skill as any).damageFormula && targetEntityId) {
      let damage = this.evaluateFormula((skill as any).damageFormula, stats, level);
      if (isCrit) {
        damage = Math.floor(damage * 1.5);
        combatLog.push(`<yellow>¡GOLPE CRÍTICO!</yellow>`);
      }
      const target = isTargetPlayer ? engine.entities.getPlayer(targetEntityId) : engine.entities.getNPC(targetEntityId);
      if (target) {
        engine.updateEntityHP(targetEntityId, Math.max((target.hpCurrent || 0) - damage, 0));
        combatLog.push(`<cyan>${caster.name}</cyan> lanza <yellow>${skill.name}</yellow> sobre <red>${targetEntityName}</red> por ${damage} de daño.`);
      }
    }

    // 3. Process Effects
    for (const effect of (skill.effects || [])) {
      let amount = 0;
      if (effect.diceCount && effect.diceSides) {
        for (let i = 0; i < effect.diceCount; i++) amount += Math.floor(Math.random() * effect.diceSides) + 1;
      }
      if (effect.modifier) amount += effect.modifier;

      if (effect.type === 'damage' && targetEntityId) {
        const target = isTargetPlayer ? engine.entities.getPlayer(targetEntityId) : engine.entities.getNPC(targetEntityId);
        if (target) {
          engine.updateEntityHP(targetEntityId, Math.max((target.hpCurrent || 0) - amount, 0));
          combatLog.push(`<cyan>${caster.name}</cyan> utiliza <yellow>${skill.name}</yellow> sobre <red>${targetEntityName}</red> por ${amount} de daño.`);
        }
      } else if (effect.type === 'heal') {
        const tid = targetEntityId || casterId;
        const target = isTargetPlayer || tid === casterId ? engine.entities.getPlayer(tid) : engine.entities.getNPC(tid);
        if (target) {
          const maxHp = StatCalculator.calculate(target).hpMax;
          engine.updateEntityHP(tid, Math.min((target.hpCurrent || 0) + amount, maxHp));
          combatLog.push(`<cyan>${caster.name}</cyan> sana a <green>${target.name}</green> por ${amount} HP.`);
        }
      } else if (effect.type === 'buff' || effect.type === 'debuff') {
        const tid = targetEntityId || casterId;
        engine.entities.applyEffect(tid, {
          sourceSkillId: skill.id,
          name: skill.name,
          type: effect.type,
          modifier: effect.modifier,
          duration: effect.duration || 30000
        });
        combatLog.push(`<cyan>${caster.name}</cyan> aplica <yellow>${skill.name}</yellow> sobre <white>${targetEntityName || caster.name}</white>.`);
      }
    }

    // 4. onHit logic (Chance Effects)
    const onHit = (skill as any).onHit;
    if (onHit?.chanceEffects && targetEntityId) {
      for (const ce of onHit.chanceEffects) {
        // Conditional chance check & Resistance deduction
        const target = isTargetPlayer ? engine.entities.getPlayer(targetEntityId) : engine.entities.getNPC(targetEntityId);
        let chance = ce.chance || 0;
        if (ce.chanceIfTargetHasAny && target) {
          if (target.activeEffects?.some((e: any) => ce.chanceIfTargetHasAny.effects.includes(e.id))) {
            chance = ce.chanceIfTargetHasAny.chance;
          }
        }

        // Apply Resistance
        const targetStats = target ? StatCalculator.calculate(target) : { resistencia: 0 };
        const finalChance = Math.max(5, chance - (targetStats.resistencia || 0)); // Min 5% chance

        if (Math.random() * 100 <= finalChance) {
          engine.entities.applyEffect(targetEntityId, { id: ce.effect, name: ce.effect, duration: (ce.duration || 2) * 10000, type: 'debuff' });
          combatLog.push(`<yellow>¡Efecto!</yellow> ${targetEntityName} sufre <magenta>${ce.effect}</magenta>.`);
        }
      }
    }

    // 4.5 Sostener Compás logic
    if (skill.id === 'bardo_sostener_compas') {
      const extendMs = 15000; // Extend by 15 seconds
      if (combat) {
        for (const p of combat.participants) {
          // You might only want to extend effects originating from the bard or all bard effects
          engine.effects.extendEffects(p.entityId, extendMs, (eff) => eff.type === 'buff' || eff.type === 'debuff');
        }
      } else {
        engine.effects.extendEffects(caster.id, extendMs, (eff) => eff.type === 'buff' || eff.type === 'debuff');
      }
      combatLog.push(`<magenta><b>¡Sostener Compás!</b></magenta> ${caster.name} extiende el ritmo de la batalla, prolongando los efectos activos.`);
      
      if (caster.bardState && caster.bardState.freeSustainAvailable) {
        caster.bardState.freeSustainAvailable = false;
        combatLog.push(`<cyan>El compás fluyó libremente (Trama consumida).</cyan>`);
      }
    }

    // 5. Bard Mechanics (Estrofa & Trama)
    if (caster.classId === 'bardo_cronica_viva' && caster.bardState) {
      if ((skill as any).estrofa?.gainFamily) {
        caster.bardState.estrofa = (caster.bardState.estrofa || 0) + 1;
        if (caster.bardState.estrofa >= 3) {
          caster.bardState.estrofa = 0;
          caster.bardState.freeSustainAvailable = true;
          combatLog.push(`<magenta><b>¡Trama Completa!</b></magenta> Sostener Compás gratuito disponible.`);
        } else {
          combatLog.push(`<magenta>Estrofa: ${caster.bardState.estrofa}/3</magenta>`);
        }
      }
    }

    if (combat) {
      // Broadcast to all participants EXCEPT the caster, because caster gets it via response.message
      const others = combat.participants.filter(p => p.isPlayer && p.entityId !== casterId);
      for (const p of others) {
        engine.emit('combat_message', p.entityId, combatLog);
      }
      // Send a ping to update the caster's UI without re-printing the log
      engine.emit('combat_message', casterId, []);
    }
    
    // Only return the message, do not include combatLog array to avoid double-printing in RESPONSE
    engine.emit('save_player', caster);
    return { success: true, message: combatLog.join('\n') };
  }

  public getSkill(nameOrId: string): SkillDef | undefined {
    if (this.skills.has(nameOrId)) return this.skills.get(nameOrId);
    const lower = nameOrId.toLowerCase();
    return Array.from(this.skills.values()).find(s => s.name.toLowerCase().includes(lower) || s.id.toLowerCase().includes(lower));
  }

  /**
   * Safe arithmetic expression evaluator.
   * Only allows: numbers, whitespace, +, -, *, /, (, ), and the floor() function.
   * Rejects anything else to prevent code injection.
   */
  private evaluateFormula(formula: string, stats: any, level: number): number {
    let expression = formula;
    // Substitute stat names with their numeric values
    for (const [stat, value] of Object.entries(stats)) {
      expression = expression.replace(new RegExp(`\\b${stat}\\b`, 'g'), value!.toString());
    }
    expression = expression.replace(/\blevel\b/g, level.toString());
    // Resolve NdM dice notation: e.g. 2d6 -> sum of 2d6 rolls
    expression = expression.replace(/(\d+)d(\d+)/g, (_, c, s) => {
      let t = 0;
      for (let i = 0; i < parseInt(c); i++) t += Math.floor(Math.random() * parseInt(s)) + 1;
      return t.toString();
    });
    // Replace floor() with a safe placeholder
    expression = expression.replace(/\bfloor\b/g, '__floor__');
    // Security: after substitutions only digits, operators, spaces, parens and __floor__ are allowed
    if (!/^[\d\s+\-*/().]+$/.test(expression.replace(/__floor__/g, ''))) {
      console.warn(`[SkillManager] Rejected unsafe formula expression: "${expression}"`);
      return 0;
    }
    // Restore floor() and evaluate using safe recursive descent parser
    expression = expression.replace(/__floor__/g, 'floor');
    try {
      return Math.floor(this.safeEval(expression));
    } catch {
      return 0;
    }
  }

  /** Tiny recursive-descent parser: handles +, -, *, /, unary -, parentheses, floor() */
  private safeEval(expr: string): number {
    let pos = 0;
    const peek = () => expr[pos];
    const consume = () => expr[pos++];
    const skipWs = () => { while (pos < expr.length && expr[pos] === ' ') pos++; };

    const parseExpr = (): number => {
      let left = parseTerm();
      skipWs();
      while (pos < expr.length && (peek() === '+' || peek() === '-')) {
        const op = consume(); skipWs();
        const right = parseTerm();
        left = op === '+' ? left + right : left - right;
        skipWs();
      }
      return left;
    };

    const parseTerm = (): number => {
      let left = parseUnary();
      skipWs();
      while (pos < expr.length && (peek() === '*' || peek() === '/')) {
        const op = consume(); skipWs();
        const right = parseUnary();
        left = op === '*' ? left * right : (right !== 0 ? left / right : 0);
        skipWs();
      }
      return left;
    };

    const parseUnary = (): number => {
      skipWs();
      if (peek() === '-') { consume(); return -parsePrimary(); }
      return parsePrimary();
    };

    const parsePrimary = (): number => {
      skipWs();
      // floor()
      if (expr.startsWith('floor', pos)) {
        pos += 5; skipWs();
        if (consume() !== '(') return 0;
        const val = parseExpr();
        skipWs(); consume(); // consume ')'
        return Math.floor(val);
      }
      // parentheses
      if (peek() === '(') {
        consume();
        const val = parseExpr();
        skipWs(); consume(); // consume ')'
        return val;
      }
      // number
      let numStr = '';
      if (peek() === '-') { numStr += consume(); }
      while (pos < expr.length && /[\d.]/.test(peek())) numStr += consume();
      return numStr ? parseFloat(numStr) : 0;
    };

    return parseExpr();
  }
}
