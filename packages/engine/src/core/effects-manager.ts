import { GameEngine } from './game-engine';
import { StatCalculator } from './stat-calculator';

export class EffectsManager {
  constructor(private engine: GameEngine) {}

  tick(now: number): void {
    const players = this.engine.entities.getPlayers();
    const npcs = Array.from(this.engine.entities.npcs.values());
    const rooms = Array.from(this.engine.entities.rooms.values());
    
    const allEntities = [...players, ...npcs, ...rooms];

    for (const entity of allEntities) {
      // Gather active effects directly on the entity
      let effectsToProcess = entity.activeEffects ? [...entity.activeEffects] : [];
      
      // If entity is player or NPC, gather effects from EQUIPPED items only
      if ((entity as any).equipment) {
        const equipSlots = Object.values((entity as any).equipment || {});
        
        for (const itemId of equipSlots) {
          if (!itemId) continue;
          const item = this.engine.entities.getItem(itemId as string);
          if (item && item.activeEffects && item.activeEffects.length > 0) {
            effectsToProcess = effectsToProcess.concat(item.activeEffects);
          }
        }
      }

      if (effectsToProcess.length === 0) continue;

      const remainingNativeEffects = [];

      for (const effect of effectsToProcess) {
        let isExpired = false;

        // Check duration (only native effects expire this way, item effects expire when unequipped or charges run out)
        if (effect.duration && entity.activeEffects.includes(effect)) {
          if (now >= effect.startTime + effect.duration) {
            isExpired = true;
            if (effect.expireMessage && (entity as any).roomId) {
              const rId = (entity as any).roomId;
              if (rId) {
                this.engine.emit('spatial_message', { roomId: rId, message: effect.expireMessage, excludeId: entity.id });
              }
              if (this.engine.entities.getPlayer(entity.id)) {
                this.engine.emit('combat_message', entity.id, [`\n${effect.expireMessage}`]);
              }
            }
            if (effect.echoEffect) {
              const echo = { 
                ...effect.echoEffect, 
                startTime: now, 
                id: effect.echoEffect.id || `eff_${now}_${Math.random()}`,
                isEcho: true 
              };
              remainingNativeEffects.push(echo);
              if (effect.echoMessage && (entity as any).roomId) {
                if (this.engine.entities.getPlayer(entity.id)) {
                  this.engine.emit('combat_message', entity.id, [`\n<magenta>${effect.echoMessage}</magenta>`]);
                }
              }
            }
          }
        }

        if (!isExpired) {
          // Process tick effects (e.g. poison, regeneration)
          if (effect.tickInterval) {
            if (!effect.lastTick) effect.lastTick = effect.startTime || now;
            
            if (now >= effect.lastTick + effect.tickInterval) {
              effect.lastTick = now;
              if (effect.aoe || 'exits' in entity) {
                this.applyAoEEffect(entity, effect);
              } else {
                this.applyTickEffect(entity, effect);
              }
            }
          }
          if (entity.activeEffects.includes(effect)) {
            remainingNativeEffects.push(effect);
          }
        }
      }

      entity.activeEffects = remainingNativeEffects;
    }
  }

  private applyTickEffect(entity: any, effect: any): void {
    const isPlayerOrNPC = !!entity.stats; // rudimentary check
    if (!isPlayerOrNPC) return;

    if (effect.type === 'damage') {
      const damage = effect.magnitude || 5;
      const newHP = Math.max((entity.hpCurrent || 0) - damage, 0);
      this.engine.updateEntityHP(entity.id, newHP);
      
      const rId = entity.roomId;
      if (this.engine.entities.getPlayer(entity.id)) {
        this.engine.emit('combat_message', entity.id, [`\n<red>Sufres ${damage} de daño por ${effect.name}.</red>`]);
      }
      
      if (entity.hpCurrent <= 0) {
        if (this.engine.entities.getPlayer(entity.id)) {
          this.engine.emit('combat_message', entity.id, [`\n<red>Has sucumbido a los efectos de ${effect.name}...</red>`]);
          // handle player death natively later
        } else {
          // It's an NPC
          if (rId) {
            const room = this.engine.entities.getRoom(rId);
            if (room) room.removeEntity(entity.id);
            this.engine.emit('spatial_message', { roomId: rId, message: `<yellow>${entity.name} cae muerto por ${effect.name}.</yellow>` });
          }
        }
      }
    } else if (effect.type === 'heal') {
      if ((entity.hpCurrent || 0) <= 0) return; // Cant heal the dead
      const heal = effect.magnitude || 5;
      const isPlayer = !!this.engine.entities.getPlayer(entity.id);
      const derived = StatCalculator.calculate(entity);
      const maxHp = derived.hpMax;
      const newHP = Math.min((entity.hpCurrent || 0) + heal, maxHp);
      this.engine.updateEntityHP(entity.id, newHP);

      if (isPlayer) {
        this.engine.emit('combat_message', entity.id, [`\n<green>Recuperas ${heal} PV por ${effect.name}.</green>`]);
      }
    }
  }

  private applyAoEEffect(entity: any, effect: any): void {
    const roomId = entity.exits !== undefined ? entity.id : entity.roomId;
    if (!roomId) return;

    const playersInRoom = this.engine.entities.getPlayers().filter(p => p.roomId === roomId && (p.hpCurrent || 0) > 0);
    if (playersInRoom.length === 0) return; // No one to see the effect

    const ambientMessage = effect.message || `<cyan>Sientes los efectos de ${effect.name}.</cyan>`;
    this.engine.emit('spatial_message', { roomId, message: ambientMessage });

    if (effect.type === 'heal') {
      const heal = effect.magnitude || 5;
      for (const p of playersInRoom) {
        const score = this.engine.commands.getScore(p.id);
        if (!score || !score.data) continue;
        const { hpMax } = score.data.derived;
        if (p.hpCurrent! < hpMax) {
          const newHP = Math.min(p.hpCurrent! + heal, hpMax);
          this.engine.updateEntityHP(p.id, newHP);
          this.engine.emit('combat_message', p.id, [`\n<green>Recuperas ${heal} PV gracias a ${effect.name}.</green>`]);
          this.engine.savePlayer(p.id);
        }
      }
    } else if (effect.type === 'damage') {
      const damage = effect.magnitude || 5;
      for (const p of playersInRoom) {
        const newHP = Math.max((p.hpCurrent || 0) - damage, 0);
        this.engine.updateEntityHP(p.id, newHP);
        this.engine.emit('combat_message', p.id, [`\n<red>Sufres ${damage} de daño por ${effect.name}.</red>`]);
        this.engine.savePlayer(p.id);
      }
    }
  }

  public extendEffects(entityId: string, durationMs: number, filter?: (eff: any) => boolean): void {
    const entity = this.engine.entities.getPlayer(entityId) || this.engine.entities.getNPC(entityId);
    if (!entity || !entity.activeEffects) return;

    for (const effect of entity.activeEffects) {
      if (effect.duration && (!filter || filter(effect))) {
        effect.duration += durationMs;
      }
    }
  }
}
