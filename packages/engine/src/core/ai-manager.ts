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
      if ((npc.hpCurrent ?? 0) <= 0) continue; // Ignore dead NPCs
      if (!npc.flags || npc.flags.length === 0) continue;
      
      // Handle healer outside of combat
      if (npc.flags.includes('healer')) {
        this.handleHealer(npc, now);
      }

      // Check if NPC is in an active combat
      const combat = Array.from(this.engine['activeCombats'].values()).find(c => 
        c.active && c.participants.some(p => p.entityId === npc.id && p.hpCurrent > 0)
      );

      if (combat) {
        if (npc.flags.includes('cobarde')) {
          this.handleCoward(npc, combat);
        }
        continue;
      }

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

      // Handle social
      if (npc.flags.includes('social')) {
        this.handleSocial(npc, now);
      }
    }
  }

  private handleHealer(npc: NPC, now: number): void {
    if (!npc.aiState.nextHealTime) npc.aiState.nextHealTime = now + 15000;
    if (now >= npc.aiState.nextHealTime) {
      npc.aiState.nextHealTime = now + 15000;
      const playersInRoom = this.engine.entities.getPlayers().filter(p => p.roomId === npc.roomId && (p.hpCurrent || 0) > 0);
      let healedAnyone = false;
      for (const p of playersInRoom) {
        const score = this.engine.commands.getScore(p.id);
        if (!score || !score.data) continue;
        const { hpMax } = score.data.derived;
        if (p.hpCurrent! < hpMax) {
          const amount = Math.floor(hpMax * 0.2) + 10;
          this.engine.updateEntityHP(p.id, Math.min(p.hpCurrent! + amount, hpMax));
          healedAnyone = true;
          this.engine.emit('spatial_message', {
            roomId: npc.roomId,
            message: `<green>${npc.name} conjura una suave luz curativa sobre ${p.name}, restaurando sus heridas.</green>`,
            excludeId: p.id
          });
          this.engine.emit('combat_message', p.id, [`\n<green>${npc.name} te ha curado ${amount} puntos de vida.</green>`]);
        }
      }
      if (healedAnyone) {
        this.engine.emit('spatial_message', { roomId: npc.roomId, message: `<green>${npc.name} recita unas palabras de consuelo.</green>` });
      }
    }
  }

  private handleCoward(npc: NPC, combat: any): void {
    const pInfo = combat.participants.find((p: any) => p.entityId === npc.id);
    if (pInfo && pInfo.hpCurrent / pInfo.hpMax < 0.3 && !pInfo.hasFled) {
      pInfo.hasFled = true;
      this.engine.emit('spatial_message', { roomId: npc.roomId, message: `<yellow>¡${npc.name} huye aterrorizado!</yellow>` });
    }
  }

  private handleSocial(npc: NPC, now: number): void {
    if (!npc.aiState.greetedPlayers) npc.aiState.greetedPlayers = new Set<string>();
    if (!npc.aiState.nextAmbientTime) npc.aiState.nextAmbientTime = now + 30000 + Math.random() * 30000;

    const playersInRoom = this.engine.entities.getPlayers().filter(p => p.roomId === npc.roomId);
    
    // Greet new players
    for (const player of playersInRoom) {
      if (!npc.aiState.greetedPlayers.has(player.id)) {
        npc.aiState.greetedPlayers.add(player.id);
        if (Math.random() < 0.5) {
          let msgStr = `<cyan>${npc.name} saluda amablemente a ${player.name}.</cyan>`;
          
          if (npc.metadata?.greetings && Array.isArray(npc.metadata.greetings)) {
            const rawMsg = npc.metadata.greetings[Math.floor(Math.random() * npc.metadata.greetings.length)];
            msgStr = `<cyan>${rawMsg.replace(/{npc}/g, npc.name).replace(/{player}/g, player.name)}</cyan>`;
          }

          this.engine.emit('spatial_message', {
            roomId: npc.roomId,
            message: msgStr
          });
        }
      }
    }

    // Ambient messages
    if (now >= npc.aiState.nextAmbientTime && playersInRoom.length > 0) {
      npc.aiState.nextAmbientTime = now + 45000 + Math.random() * 45000;
      if (npc.metadata?.ambientMessages && Array.isArray(npc.metadata.ambientMessages)) {
        const msg = npc.metadata.ambientMessages[Math.floor(Math.random() * npc.metadata.ambientMessages.length)];
        this.engine.emit('spatial_message', { roomId: npc.roomId, message: `<gray>${npc.name} ${msg}</gray>` });
      } else {
        const genericMessages = [
          "te observa con curiosidad.",
          "está concentrado en sus quehaceres.",
          "parece estar sumido en sus pensamientos.",
          "ajusta su equipo con calma.",
          "murmura algo sobre los vientos del destino.",
          "te dedica un breve asentimiento."
        ];
        const msg = genericMessages[Math.floor(Math.random() * genericMessages.length)];
        this.engine.emit('spatial_message', { roomId: npc.roomId, message: `<gray>${npc.name} ${msg}</gray>` });
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
      const targetRoom = this.engine.getRoom(randomExit.targetRoomId);
      if (!targetRoom) return;

      // Restrict wandering to the same area
      if (npc.metadata?.wanderArea) {
        if (!randomExit.targetRoomId.startsWith(npc.metadata.wanderArea)) return;
      } else if (npc.areaId && targetRoom.areaId !== npc.areaId) {
        return; // No salir del areaId asignado
      }

      // Prevent hostile beasts from entering safe rooms
      if (npc.behaviorId === 'hostile_beast' && targetRoom.metadata?.safe) {
        return;
      }

      // Move NPC
      room.removeEntity(npc.id);
      npc.roomId = targetRoom.id;
      targetRoom.addEntity(npc.id);

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

      this.engine.commands.kill(targetPlayer.id, npc.name);
    }
  }
}
