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

  public classesData: any[] = [];
  public racesData: any[] = [];

  private tickInterval: NodeJS.Timeout | null = null;

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
    console.log('Inheron Game Engine initialized.');
  }

  startTick(ms: number = 2000): void {
    if (this.tickInterval) clearInterval(this.tickInterval);
    this.tickInterval = setInterval(() => this.processTick(), ms);
    console.log(`[Engine] Tick de combate iniciado (${ms}ms)`);
  }

  private processTick(): void {
    const now = Date.now();
    this.respawnManager.tick(now);
    this.ai.tick(now);
    this.effects.tick(now);

    for (const [combatId, combat] of this.activeCombats.entries()) {
      if (!combat.active) {
        this.endCombat(combatId);
        continue;
      }

      const log = combat.processRound();
      if (log.length > 0) {
        // Find players in this combat to broadcast the log
        const players = combat.participants.filter(p => p.isPlayer);
        players.forEach(p => {
          this.emit('combat_message', p.entityId, log);
        });
      }

      // Inmediata rutina de muerte para jugadores caídos en la ronda
      combat.participants.forEach(p => {
        if (p.isPlayer && p.hpCurrent <= 0) {
          const player = this.getPlayer(p.entityId);
          // Verificar si ya procesamos su muerte (para no repetir en rondas siguientes si sigue en la lista)
          if (player && (player as any).isDead) return;
          
          if (player) {
            (player as any).isDead = true;
            const oldRoom = this.getRoom(player.roomId);
            const spawnRoomId = 'villaclara_plaza'; // Punto de respawn por defecto

            this.emit('spatial_message', {
              roomId: player.roomId,
              message: `<red>¡${player.name} ha caído en combate!</red> Su cuerpo se desvanece en un haz de luz.`,
              excludeId: player.id
            });

            const score = this.commands.getScore(player.id);
            const hpMax = score?.derived.hpMax || 100;
            
            // Perder un 10% de la experiencia del nivel actual
            const xpLost = Math.floor(player.experience * 0.10);
            player.experience = Math.max(0, player.experience - xpLost);
            
            // Reaparece con un 10% de vida
            player.hpCurrent = Math.floor(hpMax * 0.10);
            
            // Cambiar de sala
            if (oldRoom) {
              // El jugador no está en room.entities, pero el motor lo emite en spatial
            }
            player.roomId = spawnRoomId;
            
            this.emit('combat_message', player.id, [
              `\n<red><b>¡HAS MUERTO!</b></red>`,
              `Reapareces en tu punto de guardado.`,
              `Has perdido <yellow>${xpLost}</yellow> puntos de experiencia.`,
              `Tu salud está en estado crítico.`
            ]);

            this.emit('spatial_message', {
              roomId: spawnRoomId,
              message: `<yellow>Un haz de luz desciende y forma el cuerpo malherido de ${player.name}.</yellow>`,
              excludeId: player.id
            });

            // Retirar del combate
            combat.removeParticipant(player.id);

            // Guardar jugador
            Database.savePlayer(player).catch(err => console.error('Error guardando jugador tras muerte:', err));

            // Forzar un "look" asíncrono para que vea la plaza
            setTimeout(() => {
              (player as any).isDead = false; // Reset flag
              this.emit('force_look', player.id);
            }, 500);
          }
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

              // 3. Remover de la sala
              if (npc.roomId) {
                const room = this.entities.getRoom(npc.roomId);
                if (room) room.removeEntity(npc.id);
              }
            }
          }
        });

        // Award rewards to surviving players
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
          resources: {},
          equipment: this.commands.getEquipment(p.id)
        });
      }
    }

    // Add enemies (simplified for now)
    for (const id of enemyIds) {
      const npc = this.entities.getNPC(id);
      if (npc) {
        participants.push({
          entityId: npc.id,
          name: npc.name,
          iniciativa: npc.stats.destreza + npc.stats.percepcion,
          isPlayer: false,
          hpMax: 50, // placeholder
          hpCurrent: 50,
          energyMax: 20,
          energyCurrent: 20,
          resources: {},
          flags: npc.flags,
          equipment: (() => {
            const eq: Record<string, any> = {};
            for (const [slot, itemId] of Object.entries(npc.equipment)) {
              const item = this.entities.getItem(itemId);
              if (item) eq[slot] = item;
            }
            return eq;
          })()
        });
      }
    }

    const combat = new CombatManager(participants);
    this.activeCombats.set(combat.id, combat);

    this.eventLog.log({
      type: 'COMBAT_STARTED',
      data: { combatId: combat.id, participants: participants.map(p => p.name) }
    });

    return combat.id;
  }

  getActiveCombat(combatId: string): CombatManager | undefined {
    return this.activeCombats.get(combatId);
  }

  endCombat(combatId: string): void {
    this.activeCombats.delete(combatId);
    this.eventLog.log({ type: 'COMBAT_ENDED', data: { combatId } });
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
}
