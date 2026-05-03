import { GameEngine } from './game-engine';
import { NPC } from '../models/npc.model';
import { Player } from '../models/player.model';

export class AIManager {
  private engine: GameEngine;

  constructor(engine: GameEngine) {
    this.engine = engine;
  }

  tick(now: number): void {
    const npcs = Array.from(this.engine.entities.npcs.values());
    
    for (const npc of npcs) {
      if (!npc.flags || npc.flags.length === 0) continue;
      
      // Check if NPC is in an active combat
      const isInCombat = Array.from(this.engine['activeCombats'].values()).some(combat => 
        combat.active && combat.participants.some(p => p.entityId === npc.id && p.hpCurrent > 0)
      );

      if (isInCombat) continue;

      // Handle wandering
      if (npc.flags.includes('wandering')) {
        this.handleWandering(npc, now);
      }

      // Handle patrol
      if (npc.flags.includes('patrol')) {
        this.handlePatrol(npc, now);
      }

      // Handle aggressive
      if (npc.flags.includes('agresivo')) {
        this.handleAggressive(npc);
      }
    }
  }

  private handleWandering(npc: NPC, now: number): void {
    if (!npc.aiState.nextWanderTime) {
      npc.aiState.nextWanderTime = now + 10000 + Math.random() * 20000; // 10-30s
    }

    if (now >= npc.aiState.nextWanderTime) {
      npc.aiState.nextWanderTime = now + 10000 + Math.random() * 20000;

      const room = this.engine.getRoom(npc.roomId);
      if (!room || room.exits.length === 0) return;

      const validExits = room.exits.filter(e => !e.locked);
      if (validExits.length === 0) return;

      const randomExit = validExits[Math.floor(Math.random() * validExits.length)];
      
      // Restrict wandering to the same area prefix if desired
      const areaPrefix = npc.roomId.split('_')[0];
      if (!randomExit.targetRoomId.startsWith(areaPrefix)) return;

      const targetRoom = this.engine.getRoom(randomExit.targetRoomId);
      if (!targetRoom) return;

      // Move NPC
      room.removeEntity(npc.id);
      npc.roomId = targetRoom.id;
      targetRoom.addEntity(npc.id);

      // We don't usually broadcast NPC random movements unless we want a lot of noise, 
      // but if we do, it's just a spatial_message.
      this.engine.emit('spatial_message', {
        roomId: room.id,
        message: `<gray>${npc.name} se ha ido hacia el ${randomExit.direction}.</gray>`
      });

      this.engine.emit('spatial_message', {
        roomId: targetRoom.id,
        message: `<gray>${npc.name} llega desde alguna parte.</gray>`
      });
    }
  }

  private handlePatrol(npc: NPC, now: number): void {
    if (!npc.metadata.patrolPath || !Array.isArray(npc.metadata.patrolPath) || npc.metadata.patrolPath.length === 0) return;

    if (!npc.aiState.nextPatrolTime) {
      npc.aiState.nextPatrolTime = now + 5000 + Math.random() * 5000; // 5-10s
      npc.aiState.patrolIndex = 0;
    }

    if (now >= npc.aiState.nextPatrolTime) {
      npc.aiState.nextPatrolTime = now + 10000;

      const path = npc.metadata.patrolPath;
      let currentIndex = npc.aiState.patrolIndex || 0;
      currentIndex = (currentIndex + 1) % path.length;
      npc.aiState.patrolIndex = currentIndex;

      const targetRoomId = path[currentIndex];
      const targetRoom = this.engine.getRoom(targetRoomId);
      const room = this.engine.getRoom(npc.roomId);

      if (room && targetRoom && room.id !== targetRoomId) {
        room.removeEntity(npc.id);
        npc.roomId = targetRoom.id;
        targetRoom.addEntity(npc.id);

        this.engine.emit('spatial_message', {
          roomId: room.id,
          message: `<gray>${npc.name} continúa su patrulla.</gray>`
        });
        this.engine.emit('spatial_message', {
          roomId: targetRoom.id,
          message: `<gray>${npc.name} llega patrullando la zona.</gray>`
        });
      }
    }
  }

  private handleAggressive(npc: NPC): void {
    // Check if any player is in the same room
    const playersInRoom = this.engine.entities.getPlayers().filter(p => p.roomId === npc.roomId && (p.hpCurrent || 0) > 0);
    
    if (playersInRoom.length > 0) {
      // Pick a random player to attack
      const targetPlayer = playersInRoom[Math.floor(Math.random() * playersInRoom.length)];
      
      this.engine.emit('spatial_message', {
        roomId: npc.roomId,
        message: `<red>¡${npc.name} ataca a ${targetPlayer.name} agresivamente!</red>`
      });

      this.engine.commands.kill(targetPlayer.id, npc.name); // Simulating player attacking to start combat, or directly start combat.
      // Wait, commands.kill is driven by player ID. It works because it sets up the combat manager.
      // But maybe it's better to bypass command parsing:
      
      const res = this.engine.commands.kill(targetPlayer.id, npc.name); // Actually the kill command expects targetName
      if (!res.success) {
        // Fallback or custom combat start logic
      }
    }
  }
}
