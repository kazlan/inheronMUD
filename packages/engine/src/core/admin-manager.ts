import { GameEngine } from './game-engine';
import { Item } from '../models/item.model';
import { NPC } from '../models/npc.model';
import { WorldFactory } from './world-factory';
import { StatCalculator } from './stat-calculator';

/**
 * AdminManager handles administrative commands and debugging tools.
 * It has higher privileges than the standard CommandManager.
 */
export class AdminManager {
  constructor(private engine: GameEngine) {}

  /**
   * Teleports a player to a specific room.
   */
  goto(playerId: string, targetRoomId: string): { success: boolean; message: string } {
    const player = this.engine.entities.getPlayer(playerId);
    if (!player) return { success: false, message: 'Jugador no encontrado.' };

    const targetRoom = this.engine.entities.getRoom(targetRoomId);
    if (!targetRoom) return { success: false, message: `Sala "${targetRoomId}" no encontrada.` };

    const oldRoomId = player.roomId;
    this.engine.entities.movePlayer(playerId, targetRoomId);

    this.engine.emit('spatial_message', {
      roomId: oldRoomId,
      message: `<yellow>${player.name} desaparece en un destello de luz administrativa.</yellow>`,
      excludeId: player.id
    });

    this.engine.emit('spatial_message', {
      roomId: targetRoomId,
      message: `<yellow>${player.name} aparece de la nada rodeado de partículas de datos.</yellow>`,
      excludeId: player.id
    });

    this.engine.savePlayer(playerId);
    return { success: true, message: `Teletransportado a ${targetRoom.name} (${targetRoomId}).` };
  }

  /**
   * Summons an entity (NPC or Player) to the admin's location.
   */
  summon(adminId: string, targetEntityId: string): { success: boolean; message: string } {
    const admin = this.engine.entities.getPlayer(adminId);
    if (!admin) return { success: false, message: 'Admin no encontrado.' };

    const targetPlayer = this.engine.entities.getPlayer(targetEntityId);
    const targetNPC = this.engine.entities.getNPC(targetEntityId);

    if (targetPlayer) {
      const oldRoomId = targetPlayer.roomId;
      this.engine.entities.movePlayer(targetEntityId, admin.roomId);
      this.engine.savePlayer(targetEntityId);
      
      this.engine.emit('spatial_message', {
        roomId: oldRoomId,
        message: `<yellow>${targetPlayer.name} es invocado por un poder superior.</yellow>`,
        excludeId: targetEntityId
      });
      this.engine.emit('spatial_message', {
        roomId: admin.roomId,
        message: `<yellow>${targetPlayer.name} aparece ante ti por orden administrativa.</yellow>`,
        excludeId: targetEntityId
      });
      return { success: true, message: `Has invocado a ${targetPlayer.name}.` };
    }

    if (targetNPC) {
      const room = this.engine.entities.getRoom(admin.roomId);
      if (!room) return { success: false, message: 'Sala del admin no encontrada.' };
      
      // Move NPC logically (we don't have a specific roomId on NPC model, 
      // it depends on where it is registered in rooms)
      // This is a bit more complex depending on how entity-manager tracks NPCs.
      // Assuming we need to remove from old and add to new.
      this.engine.entities.moveNPC(targetEntityId, admin.roomId);
      return { success: true, message: `Has invocado al NPC ${targetNPC.name}.` };
    }

    return { success: false, message: 'Entidad no encontrada.' };
  }

  /**
   * Sets a memory flag for a player.
   */
  setFlag(playerId: string, flag: string, value?: any): { success: boolean; message: string } {
    if (value !== undefined) {
      this.engine.setVariable(playerId, flag, String(value));
      return { success: true, message: `Variable "${flag}" establecida a "${value}" para ${playerId}.` };
    } else {
      this.engine.setMemoryFlag(playerId, flag);
      return { success: true, message: `Flag "${flag}" activado para ${playerId}.` };
    }
  }

  /**
   * Gives an item to a player.
   */
  giveItem(playerId: string, itemTemplateId: string): { success: boolean; message: string } {
    const player = this.engine.entities.getPlayer(playerId);
    if (!player) return { success: false, message: 'Jugador no encontrado.' };

    // Try to find template in world factory or register a new one
    // For now, we assume we need to instantiate it.
    // This part depends on how items are loaded.
    const item = WorldFactory.createItem(this.engine, itemTemplateId);
    if (!item) return { success: false, message: `Template de ítem "${itemTemplateId}" no encontrado.` };

    player.inventory.push(item.id);
    this.engine.savePlayer(playerId);
    return { success: true, message: `Has entregado [${item.name}] a ${player.name}.` };
  }

  /**
   * Spawns an NPC in the current room.
   */
  spawn(adminId: string, npcTemplateId: string): { success: boolean; message: string } {
    const admin = this.engine.entities.getPlayer(adminId);
    if (!admin) return { success: false, message: 'Admin no encontrado.' };

    const npc = WorldFactory.createNPC(this.engine, npcTemplateId, admin.roomId);
    if (!npc) return { success: false, message: `Template de NPC "${npcTemplateId}" no encontrado.` };

    return { success: true, message: `Has invocado a [${npc.name}] en la sala.` };
  }

  /**
   * Refreshes a player's stats to maximum.
   */
  refresh(adminId: string, targetId?: string): { success: boolean; message: string } {
    const targetIdToUse = targetId || adminId;
    const player = this.engine.entities.getPlayer(targetIdToUse);
    if (!player) return { success: false, message: 'Jugador no encontrado.' };

    const derived = StatCalculator.calculate(player);
    player.hpMax = derived.hpMax;
    player.hpCurrent = derived.hpMax;
    player.energyMax = derived.energyMax;
    player.energyCurrent = derived.energyMax;

    this.engine.savePlayer(targetIdToUse);

    const targetName = targetId ? player.name : 'ti mismo';
    return { success: true, message: `Has restaurado HP y Energía/Voz a ${targetName}.` };
  }

  /**
   * Returns a detailed report of a player's state.
   */
  debugPlayer(playerId: string): any {
    const player = this.engine.entities.getPlayer(playerId);
    if (!player) return { error: 'Jugador no encontrado.' };

    const cronica = this.engine.getCronica(playerId);
    
    return {
      id: player.id,
      name: player.name,
      roomId: player.roomId,
      level: player.level,
      hp: `${player.hpCurrent}/${player.stats.constitucion * 10}`, 
      invul: player.isInvulnerable,
      stats: player.stats,
      flags: cronica?.memoryFlags || [],
      variables: cronica?.variables || {},
      quests: cronica?.activeQuests?.map((q: any) => ({ id: q.id, status: q.status })) || [],
      inventory: player.inventory
    };
  }

  /**
   * Returns a detailed report of a room's state.
   */
  inspectRoom(adminId: string): any {
    const admin = this.engine.entities.getPlayer(adminId);
    if (!admin) return { error: 'Admin no encontrado.' };

    const room = this.engine.entities.getRoom(admin.roomId);
    if (!room) return { error: 'Sala no encontrada.' };

    const players = this.engine.entities.getPlayers()
      .filter(p => p.roomId === room.id)
      .map(p => ({ id: p.id, name: p.name, hp: p.hpCurrent }));

    const npcs = this.engine.entities.getNPCsInRoom(room.id)
      .map(n => ({ id: n.id, name: n.name, behavior: n.behaviorId }));

    return {
      id: room.id,
      name: room.name,
      area: room.areaId,
      exits: room.exits,
      entities_raw: room.entities,
      players_active: players,
      npcs_active: npcs,
      scenery_keys: Object.keys(room.scenery || {})
    };
  }

  /**
   * Sets a player's level and recalculates stats.
   */
  setLevel(adminId: string, level: number, targetId?: string): { success: boolean; message: string } {
    const targetIdToUse = targetId || adminId;
    const player = this.engine.entities.getPlayer(targetIdToUse);
    if (!player) return { success: false, message: 'Jugador no encontrado.' };

    const oldLevel = player.level;
    player.level = level;
    player.experience = 0; // Reset XP to start of level

    // Recalculate stats
    const derived = StatCalculator.calculate(player);
    player.hpCurrent = derived.hpMax;
    player.energyCurrent = derived.energyMax;

    this.engine.savePlayer(targetIdToUse);

    const targetName = targetId ? player.name : 'ti mismo';
    return { 
      success: true, 
      message: `Has cambiado el nivel de ${targetName} de ${oldLevel} a ${level}. Stats recalculados.` 
    };
  }

  /**
   * Sets a player as invulnerable.
   */
  invul(adminId: string, on: boolean, targetId?: string): { success: boolean; message: string } {
    const targetIdToUse = targetId || adminId;
    const player = this.engine.entities.getPlayer(targetIdToUse);
    if (!player) return { success: false, message: 'Jugador no encontrado.' };

    player.isInvulnerable = on;
    
    // Also update active combat if player is in one
    const combat = this.engine.getCombatByPlayerId(targetIdToUse);
    if (combat) {
      const participant = combat.participants.find(p => p.entityId === targetIdToUse);
      if (participant) participant.isInvulnerable = on;
    }

    const targetName = targetId ? player.name : 'ti mismo';
    return { 
      success: true, 
      message: `Invulnerabilidad ${on ? 'ACTIVADA' : 'DESACTIVADA'} para ${targetName}.` 
    };
  }
}
