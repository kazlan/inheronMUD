import { EventEmitter } from 'events';
import { EventLog } from './event-log';
import { Player } from '../models/player.model';
import { Room } from '../models/room.model';
import { NPC } from '../models/npc.model';
import { Item } from '../models/item.model';
import { CombatManager, CombatParticipant } from './combat-manager';
import { StatCalculator } from './stat-calculator';
import { CronicaViva } from '../models/cronica-viva.model';
import { Quest } from '../interfaces/quest.interface';
import { EntityManager } from './entity-manager';
import { CommandManager } from './command-manager';
import { Database } from '../data/database';
import { RespawnManager } from './respawn-manager';
import { SkillManager } from './skill-manager';
import { ChatManager } from './chat-manager';
import { AIManager } from './ai-manager';
import { EffectsManager } from './effects-manager';
import { AdminManager } from './admin-manager';
import { ReactiveSkillService } from './reactive-skill.service';
import { NotableActionBuffer } from './notable-action-buffer';
import { MapManager } from './map-manager';

export class GameEngine extends EventEmitter {
  public eventLog: EventLog;
  public entities: EntityManager;
  public commands: CommandManager;
  private activeCombats: Map<string, CombatManager> = new Map();
  private playerCronicas: Map<string, CronicaViva> = new Map();
  public skills: SkillManager;
  public respawnManager: RespawnManager;
  public chat: ChatManager;
  public ai: AIManager;
  public effects: EffectsManager;
  public admin: AdminManager;
  public reactiveSkills: ReactiveSkillService;
  public notableActions: NotableActionBuffer;
  public map: MapManager;

  public classesData: any[] = [];
  public racesData: any[] = [];
  public helpData: Record<string, string> = {};

  private tickInterval: NodeJS.Timeout | null = null;
  public lastTickTime: number = 0;
  public tickMs: number = 2000;

  constructor() {
    super();
    this.eventLog = new EventLog();
    this.entities = new EntityManager();
    this.skills = new SkillManager();
    this.commands = new CommandManager(this);
    this.chat = new ChatManager(this);
    this.respawnManager = new RespawnManager(this);
    this.ai = new AIManager(this);
    this.effects = new EffectsManager(this);
    this.admin = new AdminManager(this);
    this.reactiveSkills = new ReactiveSkillService(this);
    this.notableActions = new NotableActionBuffer(this);
    this.map = new MapManager(this);
    console.log('Inheron Game Engine initialized.');
  }

  startTick(ms: number = 2000): void {
    this.tickMs = ms;
    if (this.tickInterval) clearInterval(this.tickInterval);
    this.tickInterval = setInterval(() => this.processTick(), ms);
    console.log(`[Engine] Tick de combate iniciado (${ms}ms)`);
  }

  private processTick(): void {
    this.lastTickTime = Date.now();
    const now = this.lastTickTime;
    this.respawnManager.tick(now);
    this.ai.tick(now);
    this.effects.tick(now);
    this.processRegeneration();

    // 0.5 — Purge orphaned combats (active=true but no living participants, or stale > 5min)
    const COMBAT_TIMEOUT_MS = 5 * 60 * 1000;
    for (const [combatId, combat] of this.activeCombats.entries()) {
      const hasLivingParticipants = combat.participants.some(p => p.hpCurrent > 0);
      const isStale = (now - combat.lastActivityTime) > COMBAT_TIMEOUT_MS;
      if (combat.active && (!hasLivingParticipants || isStale)) {
        console.warn(`[Engine] Purging orphaned combat ${combatId}`);
        this.endCombat(combatId);
      }
    }

    for (const [combatId, combat] of this.activeCombats.entries()) {
      if (!combat.active) {
        this.endCombat(combatId);
        continue;
      }

      const armoniaLogs = this.evaluateArmonias(combat);
      
      // Sincronizar participantes con sus entidades (por si hubo cambios externos)
      combat.participants.forEach(p => {
        const entity = p.isPlayer ? this.getPlayer(p.entityId) : this.entities.getNPC(p.entityId);
        if (entity && (p.isPlayer || p.hpCurrent > 0)) {
          p.hpCurrent = entity.hpCurrent ?? p.hpCurrent;
          p.activeEffects = entity.activeEffects;
          p.level = entity.level;
        }
      });

      const log = combat.processRound();
      
      // Sincronizar HP de vuelta a las entidades NPCs
      combat.participants.forEach(p => {
        if (!p.isPlayer) {
          const npc = this.entities.getNPC(p.entityId);
          if (npc) npc.hpCurrent = p.hpCurrent;
        }
      });

      if (armoniaLogs.length > 0) log.unshift(...armoniaLogs);

      if (log.length > 0) {
        // Find players in this combat to broadcast the log
        const players = combat.participants.filter(p => p.isPlayer);
        players.forEach(p => {
          this.emit('combat_message', p.entityId, log);
        });
      }

      // Process player deaths that occurred in this round
      combat.participants.forEach(p => {
        if (p.isPlayer && p.hpCurrent <= 0) {
          this.handlePlayerDeath(p.entityId, combat);
        }
      });

      if (!combat.active) {
        // Compute total XP and cleanup dead NPCs
        let totalXp = 0;
        let totalCoins = 0;
        const droppedItems: string[] = [];

        combat.participants.forEach(p => {
          if (!p.isPlayer && p.hpCurrent <= 0) {
            const npc = this.entities.getNPC(p.entityId);
            if (npc) {
              totalXp += npc.getXpReward();
              
              // 1. Calcular monedas (ej: Nivel * random(2-5))
              const npcCoins = npc.level * (Math.floor(Math.random() * 4) + 2);
              totalCoins += npcCoins;
              console.log(`[Combat:Loot] NPC ${npc.name} dropped ${npcCoins} coins. Total: ${totalCoins}`);

              // 2. Procesar Inventario (soltar a la sala)
              if (npc.inventory.length > 0 && npc.roomId) {
                const room = this.entities.getRoom(npc.roomId);
                if (room) {
                  npc.inventory.forEach(itemId => {
                    const item = this.entities.getItem(itemId);
                    if (item) {
                       room.addEntity(item.id);
                       item.roomId = room.id;
                       droppedItems.push(item.name);
                    }
                  });
                  npc.inventory = [];
                }
              }

              // 3. Remover de la sala y del registro global
              if (npc.roomId) {
                const room = this.entities.getRoom(npc.roomId);
                if (room) room.removeEntity(npc.id);
              }
              this.entities.removeNPC(npc.id); // <--- CRITICAL FIX: Kill the zombie NPC
              console.log(`[Combat:Cleanup] NPC ${npc.name} (${npc.id}) completely removed from engine.`);

              // 4. Quest Progress: Increment variables based on NPC killed
              combat.participants.filter(p => p.isPlayer).forEach(p => {
                const cronica = this.playerCronicas.get(p.entityId);
                if (cronica) {
                  if (npc.id.includes('lobo')) {
                    const current = parseInt(cronica.getVariable('lobos_muertos'));
                    cronica.setVariable('lobos_muertos', (current + 1).toString());
                    console.log(`[Quest:Progress] Player ${p.entityId} killed a wolf. Total: ${current + 1}`);
                  }
                }
              });
            }
          }
        });

         const survivingPlayers = combat.participants.filter(p => p.isPlayer && p.hpCurrent > 0);
        if (survivingPlayers.length > 0) {
           const coinsPerPlayer = Math.floor(totalCoins / survivingPlayers.length);
           
           survivingPlayers.forEach(p => {
             const player = this.getPlayer(p.entityId);
             if (player) {
                const logs: string[] = [];
                
                // XP
                if (totalXp > 0) {
                  const xpLogs = player.addExperience(totalXp);
                  logs.push(...xpLogs);
                }

                // Coins
                if (coinsPerPlayer > 0) {
                  player.coins += coinsPerPlayer;
                  logs.push(`<yellow>Has recibido ${coinsPerPlayer} monedas de cobre.</yellow>`);
                }

                // Notify about loot in room
                if (droppedItems.length > 0) {
                   logs.push(`<cyan>Al morir, los enemigos han soltado: ${droppedItems.map(i => `<white>${i}</white>`).join(', ')}.</cyan>`);
                }

                if (logs.length > 0) {
                  this.emit('combat_message', player.id, ['\n' + logs.join('\n')]);
                }

                // Sync HP and Save
                player.hpCurrent = p.hpCurrent;
                Database.savePlayer(player).catch(err => console.error('Error saving player post-combat:', err));
             }
           });
        }

        // (Dead players were already handled per-round above by handlePlayerDeath)
        this.endCombat(combatId);
      }
    }
  }

  // Registry methods (delegated to EntityManager)
  registerRoom(room: Room): void {
    this.entities.registerRoom(room);
  }

  registerPlayer(player: Player): void {
    this.entities.registerPlayer(player);
    if (!this.playerCronicas.has(player.id)) {
      this.playerCronicas.set(player.id, new CronicaViva(player.id));
    }
  }

  registerNPC(npc: NPC): void {
    this.entities.registerNPC(npc);
  }

  registerItem(item: Item): void {
    this.entities.registerItem(item);
  }

  getRoom(id: string): Room | undefined {
    return this.entities.getRoom(id);
  }

  getPlayer(id: string): Player | undefined {
    return this.entities.getPlayer(id);
  }

  savePlayer(id: string): void {
    const player = this.getPlayer(id);
    if (player) {
      this.emit('save_player', player);
    }
  }

  /**
   * 0.4 — Centralized player death handler.
   * Called once per player per combat round. Handles XP loss, respawn, messaging and save.
   */
  public handlePlayerDeath(playerId: string, combat: CombatManager): void {
    const player = this.getPlayer(playerId);
    if (!player || (player as any).isDead) return;

    (player as any).isDead = true;
    const spawnRoomId = 'villaclara_plaza';

    // Notify others in the room
    this.emit('spatial_message', {
      roomId: player.roomId,
      message: `<red>¡${player.name} ha caído en combate!</red> Su cuerpo se desvanece en un haz de luz.`,
      excludeId: player.id
    });

    const score = this.commands.getScore(player.id);
    const hpMax = score?.data?.derived?.hpMax ?? 100;

    // Lose 10% of current experience
    const xpLost = Math.floor(player.experience * 0.10);
    player.experience = Math.max(0, player.experience - xpLost);

    // Respawn with 10% HP
    player.hpCurrent = Math.max(1, Math.floor(hpMax * 0.10));

    // Move to respawn room
    player.roomId = spawnRoomId;

    // Reset bard Trama on death (per spec)
    if (player.bardState) {
      player.bardState.estrofa = 0;
      player.bardState.aplauso = 0;
      player.bardState.freeSustainAvailable = false;
    }
    // Clear active effects
    player.activeEffects = [];

    // Notify player
    this.emit('combat_message', player.id, [
      `\n<red><b>¡HAS MUERTO!</b></red>`,
      `Reapareces en tu punto de guardado.`,
      xpLost > 0 ? `Has perdido <yellow>${xpLost}</yellow> puntos de experiencia.` : '',
      `Tu salud está en estado crítico.`
    ].filter(Boolean));

    this.emit('spatial_message', {
      roomId: spawnRoomId,
      message: `<yellow>Un haz de luz desciende y forma el cuerpo malherido de ${player.name}.</yellow>`,
      excludeId: player.id
    });

    // Remove from combat
    combat.removeParticipant(player.id);

    // Persist
    Database.savePlayer(player).catch(err => console.error('[Engine] Error saving player after death:', err));

    // After brief delay: reset flag and trigger look at spawn room
    setTimeout(() => {
      (player as any).isDead = false;
      this.emit('force_look', player.id);
    }, 500);
  }

  getEventLog(): EventLog {
    return this.eventLog;
  }

  // Interaction Commands (delegated to CommandManager)
  look(playerId: string, targetName?: string): any {
    return this.commands.look(playerId, targetName);
  }

  move(playerId: string, direction: string): { success: boolean; message: string; roomId?: string } {
    return this.commands.move(playerId, direction);
  }

  get(playerId: string, itemName: string): { success: boolean; message: string } {
    return this.commands.get(playerId, itemName);
  }

  drop(playerId: string, itemName: string): { success: boolean; message: string } {
    return this.commands.drop(playerId, itemName);
  }

  getInventory(playerId: string): any[] {
    return this.commands.getInventory(playerId);
  }

  getScore(playerId: string): any {
    return this.commands.getScore(playerId);
  }

  initiateCombat(playerIds: string[], enemyIds: string[]): string {
    // Check if any player or enemy is already in an active combat
    const existingCombat = Array.from(this.activeCombats.values()).find(c => 
      c.active && c.participants.some(p => playerIds.includes(p.entityId) || enemyIds.includes(p.entityId))
    );

    if (existingCombat) {
      // If found, and we want to add more participants, we should handle that.
      // For now, let's just return the existing combat ID.
      // (Advanced: add playerIds that are not yet in the combat)
      for (const pid of playerIds) {
        if (!existingCombat.participants.some(p => p.entityId === pid)) {
          // Logic to add participant to existing combat... 
          // (Requires CombatManager.addParticipant which doesn't exist yet, 
          // or just return and let the system handle joining logic elsewhere)
        }
      }
      return existingCombat.id;
    }

    const participants: CombatParticipant[] = [];

    // Add players
    for (const id of playerIds) {
      const p = this.entities.getPlayer(id);
      if (p) {
        const derived = StatCalculator.calculate(p);
        participants.push({
          entityId: p.id,
          name: p.name,
          iniciativa: derived.iniciativa,
          isPlayer: true,
          hpMax: derived.hpMax,
          hpCurrent: derived.hpCurrent,
          energyMax: derived.energyMax,
          energyCurrent: derived.energyCurrent,
          isInvulnerable: p.isInvulnerable,
          resources: {},
          equipment: this.commands.getEquipment(p.id),
          level: p.level,
          activeEffects: p.activeEffects
        });
      }
    }

    // Add enemies
    for (const id of enemyIds) {
      const npc = this.entities.getNPC(id);
      if (npc) {
        const derived = StatCalculator.calculate(npc);
        
        // Persist the calculated max HP on the NPC if not already there
        if (npc.hpCurrent === undefined) {
          npc.hpMax = derived.hpMax;
          npc.hpCurrent = derived.hpMax;
        }

        participants.push({
          entityId: npc.id,
          name: npc.name,
          iniciativa: derived.iniciativa,
          isPlayer: false,
          hpMax: derived.hpMax,
          hpCurrent: npc.hpCurrent,
          energyMax: derived.energyMax,
          energyCurrent: derived.energyMax,
          resources: {},
          flags: npc.flags,
          equipment: (() => {
            const eq: Record<string, any> = {};
            for (const [slot, itemId] of Object.entries(npc.equipment)) {
              const item = this.entities.getItem(itemId);
              if (item) eq[slot] = item;
            }
            return eq;
          })(),
          level: npc.level,
          activeEffects: npc.activeEffects
        });
      }
    }

    const combat = new CombatManager(participants, (actorId, type, mag) => {
      if (type === 'armonia_ridiculo_evade') {
         const bard = this.entities.getPlayer(actorId);
         if (bard && bard.bardState) {
            bard.bardState.estrofa = Math.min(5, (bard.bardState.estrofa || 0) + 1);
            if (mag === 1) { // Critical failure
               bard.bardState.aplauso = Math.min(4, (bard.bardState.aplauso || 0) + 1);
               this.emit('combat_message', bard.id, ['\n<magenta>¡El patético fallo del enemigo te otorga +1 Aplauso y +1 Estrofa!</magenta>']);
            } else {
               this.emit('combat_message', bard.id, ['\n<yellow>El enemigo falla gracias a tu Armonía. Ganas +1 Estrofa.</yellow>']);
            }
         }
      } else {
         this.notableActions.recordAction(actorId, type as any, mag);
      }
    });
    this.activeCombats.set(combat.id, combat);

    this.eventLog.log({
      type: 'COMBAT_STARTED',
      data: { combatId: combat.id, participants: participants.map(p => p.name) }
    });

    // Forzar actualización inmediata de la UI para los jugadores involucrados
    playerIds.forEach(id => this.emit('combat_message', id, []));

    return combat.id;
  }

  getActiveCombat(combatId: string): CombatManager | undefined {
    return this.activeCombats.get(combatId);
  }

  endCombat(combatId: string): void {
    const combat = this.activeCombats.get(combatId);
    if (combat) {
      combat.participants.filter(p => p.isPlayer).forEach(p => {
        this.emit('combat_ended', p.entityId);
      });
    }
    this.activeCombats.delete(combatId);
    this.eventLog.log({ type: 'COMBAT_ENDED', data: { combatId } });
  }

  private processRegeneration(): void {
    const onlinePlayers = this.entities.getPlayers().filter(p => p.isOnline);
    
    for (const player of onlinePlayers) {
      if ((player.hpCurrent || 0) <= 0) continue; // <--- Dead men don't regenerate
      const derived = StatCalculator.calculate(player);
      const inCombat = !!this.getCombatByPlayerId(player.id);
      
      // HP Regen: 
      // - Out of combat: 5% of max
      // - In combat: 1% of max
      const hpRegenBase = inCombat ? 0.01 : 0.05;
      let hpRegen = Math.floor(derived.hpMax * hpRegenBase);
      if (hpRegen < 1) hpRegen = 1;
      
      // Energy/Voice Regen:
      let energyRegen = 0;
      if (player.classId === 'bardo_cronica_viva') {
        // Bard Formula: 8 + floor(presencia / 2)
        // Document specifies this per round/tick.
        const baseRegen = 8 + Math.floor((player.stats.presencia || 0) / 2);
        // We give a small boost out of combat (1.5x) to maintain the "faster recovery when resting" feel
        energyRegen = inCombat ? baseRegen : Math.floor(baseRegen * 1.5);
      } else {
        // Default for other classes
        const energyRegenBase = inCombat ? 0.02 : 0.08;
        energyRegen = Math.floor(derived.energyMax * energyRegenBase);
      }
      if (energyRegen < 1) energyRegen = 1;
      
      const oldHp = player.hpCurrent ?? derived.hpMax;
      const oldEnergy = player.energyCurrent ?? derived.energyMax;
      
      if (oldHp >= derived.hpMax && oldEnergy >= derived.energyMax) continue;

      player.hpCurrent = Math.min(derived.hpMax, oldHp + hpRegen);
      player.energyCurrent = Math.min(derived.energyMax, oldEnergy + energyRegen);
      
      // Notify if changed
      if (player.hpCurrent !== oldHp || player.energyCurrent !== oldEnergy) {
         this.emit('save_player', player);
      }
    }
  }

  getCombatByPlayerId(playerId: string): CombatManager | undefined {
    for (const combat of this.activeCombats.values()) {
      if (combat.participants.some(p => p.entityId === playerId)) {
        return combat;
      }
    }
    return undefined;
  }

  // Quest & Memory Methods
  assignQuest(playerId: string, quest: Quest): void {
    const cronica = this.playerCronicas.get(playerId);
    if (cronica) {
      cronica.addQuest(quest);
      this.eventLog.log({
        type: 'QUEST_ASSIGNED',
        actorId: playerId,
        data: { questId: quest.id, title: quest.title }
      });
    }
  }

  checkMemoryFlag(playerId: string, flag: string): boolean {
    const cronica = this.playerCronicas.get(playerId);
    return cronica ? cronica.hasFlag(flag) : false;
  }

  setMemoryFlag(playerId: string, flag: string): void {
    const cronica = this.playerCronicas.get(playerId);
    if (cronica) {
      cronica.setFlag(flag);
      this.eventLog.log({
        type: 'MEMORY_FLAG_SET',
        actorId: playerId,
        data: { flag }
      });
    }
  }

  setVariable(playerId: string, key: string, value: string): void {
    const cronica = this.playerCronicas.get(playerId);
    if (cronica) {
      cronica.setVariable(key, value);
      this.eventLog.log({
        type: 'VARIABLE_SET',
        actorId: playerId,
        data: { key, value }
      });
    }
  }

  getCronica(playerId: string): any {
    const cronica = this.playerCronicas.get(playerId);
    return cronica ? cronica.toJSON() : null;
  }



  /**
   * Core execution loop for processing ticks or commands
   */
  executeCommand(playerId: string, command: string, args: string[]): void {
    const player = this.entities.getPlayer(playerId);
    if (!player) return;

    const requestId = `req_${Date.now()}`;
    const startTime = Date.now();

    try {
      // Command routing logic will go here
      this.eventLog.log({
        type: 'COMMAND_EXECUTED',
        actorId: playerId,
        roomId: player.roomId,
        data: { command, args, status: 'ok' },
        metadata: {
          request_id: requestId,
          duration_ms: Date.now() - startTime
        }
      });
    } catch (error: any) {
      this.eventLog.log({
        type: 'COMMAND_ERROR',
        actorId: playerId,
        data: { command, args, error: error.message },
        metadata: {
          request_id: requestId,
          duration_ms: Date.now() - startTime
        }
      });
    }
  }

  evaluateArmonias(combat: any): string[] {
    const logs: string[] = [];
    if (!combat || !combat.participants) return logs;
    const bards = combat.participants.filter((p: any) => p.isPlayer && this.entities.getPlayer(p.entityId)?.classId === 'bardo_cronica_viva');
    if (bards.length === 0) return logs;

    for (const bardP of bards) {
      const player = this.entities.getPlayer(bardP.entityId);
      if (!player || !player.activeEffects) continue;

      const activeEffectIds = new Set(player.activeEffects.map(e => e.sourceSkillId));

      // 1. Armonía de Vanguardia (Himno de la Primera Chapa + Paso de Liria)
      if (activeEffectIds.has('bardo_himno_primera_chapa') && activeEffectIds.has('bardo_paso_liria')) {
        if (!(bardP as any)._armoniaVanguardiaActive) {
          (bardP as any)._armoniaVanguardiaActive = true;
          logs.push(`🎶 <magenta>Armonía de Vanguardia:</magenta> el grupo encuentra el paso común guiados por ${player.name}.`);
        }
      } else {
        (bardP as any)._armoniaVanguardiaActive = false;
      }

      // 2. Check enemies for Armonía de Ridículo
      for (const p of combat.participants) {
        if (p.isPlayer) continue;
        const npc = this.entities.getNPC(p.entityId);
        if (npc && npc.activeEffects) {
          const npcEffectIds = new Set(npc.activeEffects.map(e => e.sourceSkillId));
          if (npcEffectIds.has('bardo_copla_pegadiza') && npcEffectIds.has('bardo_sincopa_burlona')) {
            if (!(p as any)._armoniaRidiculoActive) {
              (p as any)._armoniaRidiculoActive = true;
              (p as any)._bardEntityId = bardP.entityId;
              logs.push(`🎭 <magenta>Armonía de Ridículo:</magenta> ${npc.name} empieza a perder contra su propio ritmo.`);
            }
          } else {
             (p as any)._armoniaRidiculoActive = false;
          }
        }
      }
    }

    return logs;
  }

  updateEntityHP(entityId: string, newHP: number): void {
    const player = this.entities.getPlayer(entityId);
    const npc = this.entities.getNPC(entityId);
    const entity = player || npc;
    
    if (entity) {
      entity.hpCurrent = newHP;
      
      // Sync to combat if participant
      for (const combat of this.activeCombats.values()) {
        const participant = combat.participants.find(p => p.entityId === entityId);
        if (participant) {
          participant.hpCurrent = newHP;
        }
      }

      if (player) {
        this.savePlayer(player.id);
      }
    }
  }
}
