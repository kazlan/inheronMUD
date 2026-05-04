import { GameEngine } from './game-engine';
import { Item } from '../models/item.model';
import { StatCalculator } from './stat-calculator';

export class CommandManager {
  constructor(private engine: GameEngine) {}

  private matchEntityName(entityName: string, query: string): boolean {
    if (!query) return false;
    const nameLower = entityName.toLowerCase();
    const queryLower = query.toLowerCase();
    if (nameLower === queryLower) return true;
    const words = nameLower.split(/\s+/);
    if (words.some(w => w.startsWith(queryLower))) return true;
    return nameLower.startsWith(queryLower);
  }

  look(playerId: string, targetName?: string): any {
    const player = this.engine.entities.getPlayer(playerId);
    if (!player) return null;

    const room = this.engine.entities.getRoom(player.roomId);
    if (!room) return null;

    if (targetName) {
      // 1. Try to find in scenery
      if (room.scenery) {
        for (const [key, desc] of Object.entries(room.scenery)) {
          if (this.matchEntityName(key, targetName)) {
            const message = typeof desc === 'string' ? desc : desc.description;
            return { message };
          }
        }
      }

      // 2. Try to find NPC or Item
      for (const id of room.entities) {
        const npc = this.engine.entities.getNPC(id);
        const item = this.engine.entities.getItem(id);
        if (npc && this.matchEntityName(npc.name, targetName)) {
          return { message: npc.description };
        }
        if (item && this.matchEntityName(item.name, targetName)) {
          return { message: item.description };
        }
      }

      return { message: `No ves nada especialmente interesante en "${targetName}".` };
    }

    // Default look behavior (entire room)
    console.log(`[Command:Look] Player ${playerId} in room ${room.id}. Entities in room:`, room.entities);

    // Check room effects
    if (room.activeEffects.some(e => e.id === 'oscuridad' || e.type === 'oscuridad')) {
      // Allow viewing if player has a light source (we could check inventory for 'torch')
      // For now, it's just dark.
      const hasLight = player.inventory.some(id => {
        const item = this.engine.entities.getItem(id);
        return item && item.metadata && item.metadata.lightSource;
      });
      if (!hasLight) {
        return { message: "Está demasiado oscuro para ver nada. Necesitas una fuente de luz." };
      }
    }

    let roomDesc = room.description;
    if (room.scenery) {
      for (const key of Object.keys(room.scenery)) {
        // Regex para emparejar la palabra completa, ignorando mayúsculas/minúsculas
        const regex = new RegExp(`\\b(${key})\\b`, 'gi');
        roomDesc = roomDesc.replace(regex, '<b>$1</b>');
      }
    }

    const occupants = room.entities.map(id => {
      const npc = this.engine.entities.getNPC(id);
      const item = this.engine.entities.getItem(id);
      
      if (npc) {
        console.log(`[Command:Look] Found NPC: ${npc.name} (${npc.id})`);
        const json = npc.toJSON() as any;
        json.questIndicator = this.getQuestIndicator(playerId, npc.id);
        json.isMob = npc.behaviorId === 'hostile_beast' || npc.behaviorId === 'hostile_boss';
        json.levelDiff = npc.level - (player?.level || 1);
        return json;
      }
      if (item) {
        console.log(`[Command:Look] Found Item: ${item.name} (${item.id})`);
        return item.toJSON();
      }
      
      console.warn(`[Command:Look] Entity ID ${id} in room ${room.id} not found in entity maps!`);
      return null;
    }).filter(Boolean);

    const roomData = room.toJSON();
    roomData.description = roomDesc; // Use the formatted description

    return {
      room: roomData,
      occupants: occupants
    };
  }

  private getQuestIndicator(playerId: string, npcId: string): string | null {
    if (npcId === 'anciano_sabio') {
      const isDone = this.engine.checkMemoryFlag(playerId, 'quest_lobos_done');
      if (isDone) return null;

      const lobosMuertos = parseInt(this.engine.getCronica(playerId)?.flags?.['lobos_muertos'] || '0');
      if (lobosMuertos >= 3) return '?'; // Ready to turn in
      return '!'; // Available
    }
    return null;
  }

  move(playerId: string, direction: string): { success: boolean; message: string; roomId?: string } {
    const player = this.engine.entities.getPlayer(playerId);
    if (!player) return { success: false, message: 'Jugador no encontrado' };

    const currentRoom = this.engine.entities.getRoom(player.roomId);
    if (!currentRoom) return { success: false, message: 'Sala actual no encontrada' };

    const exit = currentRoom.exits.find(e => e.direction.toLowerCase() === direction.toLowerCase());
    if (!exit) return { success: false, message: `No hay salida hacia el ${direction}.` };

    if (exit.locked) return { success: false, message: 'Esa puerta está cerrada con llave.' };

    const targetRoom = this.engine.entities.getRoom(exit.targetRoomId);
    if (!targetRoom) return { success: false, message: 'La salida parece llevar a ninguna parte...' };

    player.roomId = targetRoom.id;

    // Opposite direction helper
    const opposites: Record<string, string> = {
      north: 'sur', south: 'norte', east: 'oeste', west: 'este',
      northeast: 'suroeste', northwest: 'sureste', southeast: 'noroeste', southwest: 'noreste',
      up: 'abajo', down: 'arriba',
      norte: 'sur', sur: 'norte', este: 'oeste', oeste: 'este',
      noreste: 'suroeste', noroeste: 'sureste', sureste: 'noroeste', suroeste: 'noreste',
      arriba: 'abajo', abajo: 'arriba'
    };
    const opp = opposites[direction.toLowerCase()] || 'algún lugar';

    // Translate leaving direction to Spanish for log
    const dirTranslate: Record<string, string> = {
      north: 'el norte', south: 'el sur', east: 'el este', west: 'el oeste',
      northeast: 'el noreste', northwest: 'el noroeste', southeast: 'el sureste', southwest: 'el suroeste',
      up: 'arriba', down: 'abajo',
      norte: 'el norte', sur: 'el sur', este: 'el este', oeste: 'el oeste',
      noreste: 'el noreste', noroeste: 'el noroeste', sureste: 'el sureste', suroeste: 'el suroeste',
      arriba: 'arriba', abajo: 'abajo'
    };
    const dirStr = dirTranslate[direction.toLowerCase()] || direction;

    this.engine.emit('spatial_message', {
      roomId: currentRoom.id,
      message: `<yellow>${player.name} se ha ido hacia ${dirStr}.</yellow>`,
      excludeId: player.id
    });

    this.engine.emit('spatial_message', {
      roomId: targetRoom.id,
      message: `<yellow>${player.name} llega desde el ${opp}.</yellow>`,
      excludeId: player.id
    });

    this.engine.getEventLog().log({
      type: 'PLAYER_MOVED',
      actorId: playerId,
      roomId: targetRoom.id,
      data: { direction, from: currentRoom.id, to: targetRoom.id }
    });

    this.engine.savePlayer(playerId);
    return { success: true, message: `Te mueves hacia el ${direction}.`, roomId: targetRoom.id };
  }

  open(playerId: string, direction: string): { success: boolean; message: string } {
    const player = this.engine.entities.getPlayer(playerId);
    if (!player) return { success: false, message: 'Jugador no encontrado' };

    const room = this.engine.entities.getRoom(player.roomId);
    if (!room) return { success: false, message: 'Sala actual no encontrada' };

    const exit = room.exits.find(e => e.direction.toLowerCase() === direction.toLowerCase() || e.direction.toLowerCase().startsWith(direction.toLowerCase()));
    if (!exit) return { success: false, message: `No hay salida hacia el ${direction}.` };

    if (!exit.locked) return { success: false, message: 'Esa puerta ya está abierta.' };

    // Check if it requires a key
    if ((exit as any).keyId) {
      const keyId = (exit as any).keyId;
      const hasKey = player.inventory.some(id => {
        const item = this.engine.entities.getItem(id);
        return item && (item.id === keyId || item.id.startsWith(keyId + '_'));
      });
      if (!hasKey) {
        return { success: false, message: 'Necesitas una llave para abrir esto.' };
      }
    }

    exit.locked = false;
    
    // Unlock reverse exit
    const opposites: Record<string, string> = {
      north: 'south', south: 'north', east: 'west', west: 'east',
      northeast: 'southwest', northwest: 'southeast', southeast: 'northwest', southwest: 'northeast',
      up: 'down', down: 'up',
      norte: 'sur', sur: 'norte', este: 'oeste', oeste: 'este',
      noreste: 'suroeste', noroeste: 'sureste', sureste: 'noroeste', suroeste: 'noreste',
      arriba: 'abajo', abajo: 'arriba'
    };
    const opp = opposites[exit.direction.toLowerCase()] || '';
    
    const targetRoom = this.engine.entities.getRoom(exit.targetRoomId);
    if (targetRoom && opp) {
      const revExit = targetRoom.exits.find(e => e.direction.toLowerCase() === opp);
      if (revExit) revExit.locked = false;
    }

    this.engine.emit('spatial_message', {
      roomId: room.id,
      message: `<yellow>${player.name} ha abierto la puerta hacia el ${exit.direction}.</yellow>`,
      excludeId: player.id
    });

    return { success: true, message: `Has abierto la puerta hacia el ${exit.direction}.` };
  }

  interact(playerId: string, targetName: string, verb?: string): { success: boolean; message: string; data?: any; isContextualMatch?: boolean } {
    const player = this.engine.entities.getPlayer(playerId);
    if (!player) return { success: false, message: 'Jugador no encontrado' };

    const room = this.engine.entities.getRoom(player.roomId);
    if (!room) return { success: false, message: 'Sala actual no encontrada' };

    // Check scenery interactions
    if (room.scenery) {
      for (const [key, value] of Object.entries(room.scenery)) {
        if (this.matchEntityName(key, targetName)) {
          if (typeof value === 'object' && value.interactions) {
            
            // Si nos pasan un verbo contextual, comprobar si está permitido
            if (verb) {
              const allowedVerbs = value.interactions.verbs || [];
              if (!allowedVerbs.includes(verb.toLowerCase())) {
                return { success: false, isContextualMatch: false, message: `No puedes ${verb} ${key}.` };
              }
            }

            // Process interaction
            // For now, we support "unlock_exit" and "message"
            let msg = value.interactions.message || 'Interactúas con el objeto.';
            
            if (value.interactions.action === 'unlock_exit' && value.interactions.target) {
              const exit = room.exits.find(e => e.direction === value.interactions.target);
              if (exit && exit.locked) {
                exit.locked = false;
                // Try unlocking reverse exit
                const opposites: Record<string, string> = {
                  north: 'south', south: 'north', east: 'west', west: 'east',
                  up: 'down', down: 'up'
                };
                const opp = opposites[exit.direction.toLowerCase()] || '';
                const targetRoom = this.engine.entities.getRoom(exit.targetRoomId);
                if (targetRoom && opp) {
                  const revExit = targetRoom.exits.find(e => e.direction.toLowerCase() === opp);
                  if (revExit) revExit.locked = false;
                }
                msg += ` Has abierto la salida hacia el ${exit.direction}.`;
              }
            }

            this.engine.emit('spatial_message', {
              roomId: room.id,
              message: `<yellow>${player.name} interactúa con ${key}.</yellow>`,
              excludeId: player.id
            });

            return { success: true, isContextualMatch: true, message: msg };
          } else {
            return { success: false, isContextualMatch: !!verb, message: `No puedes interactuar con eso, solo observarlo.` };
          }
        }
      }
    }

    // Check inventory items (like wands with effects/charges)
    const itemIndex = player.inventory.findIndex(id => {
      const item = this.engine.entities.getItem(id);
      return item && this.matchEntityName(item.name, targetName);
    });

    if (itemIndex !== -1) {
      const itemId = player.inventory[itemIndex];
      const item = this.engine.entities.getItem(itemId);
      
      if (item && (item.type === 'CONSUMABLE' || (item.metadata && item.metadata.effects))) {
        let msg = `Usas ${item.name}. `;
        let destroyed = false;
        
        // Handle charges or one-time use
        if (item.metadata && item.metadata.charges !== undefined) {
          if (item.metadata.charges <= 0) {
            return { success: false, message: `${item.name} no tiene más cargas.` };
          }
          item.metadata.charges--;
          msg += `(Quedan ${item.metadata.charges} cargas). `;
          if (item.metadata.charges === 0) {
            msg += `<red>${item.name} se desintegra tras agotar su poder.</red> `;
            destroyed = true;
          }
        } else if (item.type === 'CONSUMABLE') {
          destroyed = true; // Potions, food
        }

        if (destroyed) {
          player.inventory.splice(itemIndex, 1);
        }

        // Apply effects
        if (item.metadata && item.metadata.effects) {
          const effects = Array.isArray(item.metadata.effects) ? item.metadata.effects : [item.metadata.effects];
          for (const effect of effects) {
            this.engine.entities.applyEffect(player.id, effect);
            if (effect.message) msg += effect.message + ' ';
          }
        }

        // Apply direct healing value for standard consumables
        if (item.type === 'CONSUMABLE' && item.value > 0) {
          const { hpMax } = this.engine.commands.getScore(player.id).derived;
          const heal = item.value;
          player.hpCurrent = Math.min((player.hpCurrent || 0) + heal, hpMax);
          msg += `<green>Recuperas ${heal} puntos de vida.</green> `;
        }
        
        this.engine.savePlayer(playerId);
        return { success: true, message: msg };
      } else {
        return { success: false, message: `No parece que puedas usar ${item?.name} de esa manera.` };
      }
    }

    return { success: false, message: `No ves nada con lo que interactuar llamado "${targetName}".` };
  }

  get(playerId: string, itemName: string): { success: boolean; message: string } {
    const player = this.engine.entities.getPlayer(playerId);
    if (!player) return { success: false, message: 'Jugador no encontrado.' };

    const room = this.engine.entities.getRoom(player.roomId);
    if (!room) return { success: false, message: 'Sala no encontrada.' };

    const item = room.entities
      .map(id => this.engine.entities.getItem(id))
      .filter((i): i is Item => !!i && this.matchEntityName(i.name, itemName))[0];

    if (!item) return { success: false, message: `No ves ningún "${itemName}" aquí.` };

    room.removeEntity(item.id);
    player.inventory.push(item.id);

    this.engine.getEventLog().log({
      type: 'ITEM_PICKED_UP',
      actorId: playerId,
      data: { itemId: item.id, itemName: item.name }
    });

    this.engine.savePlayer(playerId);
    return { success: true, message: `Recoges: ${item.name}.` };
  }

  drop(playerId: string, itemName: string): { success: boolean; message: string } {
    const player = this.engine.entities.getPlayer(playerId);
    if (!player) return { success: false, message: 'Jugador no encontrado.' };

    const itemIndex = player.inventory.findIndex(id => {
      const item = this.engine.entities.getItem(id);
      return item && this.matchEntityName(item.name, itemName);
    });

    if (itemIndex === -1) return { success: false, message: `No llevas nada llamado "${itemName}".` };

    const itemId = player.inventory.splice(itemIndex, 1)[0];
    const room = this.engine.entities.getRoom(player.roomId);
    if (room) room.addEntity(itemId);

    this.engine.getEventLog().log({
      type: 'ITEM_DROPPED',
      actorId: playerId,
      data: { itemId, roomId: player.roomId }
    });

    this.engine.savePlayer(playerId);
    return { success: true, message: `Sueltas: ${this.engine.entities.getItem(itemId)?.name}.` };
  }

  getInventory(playerId: string): any[] {
    const player = this.engine.entities.getPlayer(playerId);
    if (!player) return [];
    return player.inventory
      .map(id => this.engine.entities.getItem(id))
      .filter(Boolean)
      .map(i => i!.toJSON());
  }

  getEquipment(playerId: string): any {
    const player = this.engine.entities.getPlayer(playerId);
    if (!player) return {};
    
    const eq: Record<string, any> = {};
    for (const [slot, itemId] of Object.entries(player.equipment)) {
      const item = this.engine.entities.getItem(itemId as string);
      if (item) eq[slot] = item.toJSON();
    }
    return eq;
  }

  equip(playerId: string, itemName: string): { success: boolean; message: string; data?: any } {
    const player = this.engine.entities.getPlayer(playerId);
    if (!player) return { success: false, message: 'Jugador no encontrado.' };

    const itemIndex = player.inventory.findIndex(id => {
      const item = this.engine.entities.getItem(id);
      return item && this.matchEntityName(item.name, itemName);
    });

    if (itemIndex === -1) return { success: false, message: `No llevas nada llamado "${itemName}".` };

    const itemId = player.inventory[itemIndex];
    const item = this.engine.entities.getItem(itemId);

    if (item?.type !== 'EQUIPMENT' || !item.equipSlot) {
      return { success: false, message: `No puedes equiparte ${item?.name || 'eso'}.` };
    }

    // Unequip existing if any
    const existingItemId = player.equipment[item.equipSlot];
    if (existingItemId) {
      player.inventory.push(existingItemId);
    }

    // Equip new
    player.inventory.splice(itemIndex, 1);
    player.equipment[item.equipSlot] = itemId;

    this.engine.getEventLog().log({ type: 'ITEM_EQUIPPED', actorId: playerId, data: { itemId, slot: item.equipSlot } });

    this.engine.savePlayer(playerId);
    return { success: true, message: `Te has equipado: ${item.name} en [${item.equipSlot}].`, data: this.getScore(playerId) };
  }

  unequip(playerId: string, slotOrName: string): { success: boolean; message: string; data?: any } {
    const player = this.engine.entities.getPlayer(playerId);
    if (!player) return { success: false, message: 'Jugador no encontrado.' };

    // Find slot by name or by item name
    let targetSlot = '';
    let targetItemId = '';

    for (const [slot, itemId] of Object.entries(player.equipment)) {
      const item = this.engine.entities.getItem(itemId as string);
      if (slot.toLowerCase() === slotOrName.toLowerCase() || (item && this.matchEntityName(item.name, slotOrName))) {
        targetSlot = slot;
        targetItemId = itemId as string;
        break;
      }
    }

    if (!targetSlot) return { success: false, message: `No tienes nada equipado que coincida con "${slotOrName}".` };

    delete player.equipment[targetSlot];
    player.inventory.push(targetItemId);

    const item = this.engine.entities.getItem(targetItemId);

    this.engine.getEventLog().log({ type: 'ITEM_UNEQUIPPED', actorId: playerId, data: { itemId: targetItemId, slot: targetSlot } });

    this.engine.savePlayer(playerId);
    return { success: true, message: `Te has desequipado: ${item?.name || 'objeto'}.`, data: this.getScore(playerId) };
  }

  getScore(playerId: string): any {
    const player = this.engine.entities.getPlayer(playerId);
    if (!player) return null;

    const derived = StatCalculator.calculate(player);
    return {
      name: player.name,
      class: player.classId,
      race: player.raceId,
      level: player.level,
      stats: player.stats,
      derived,
      gremioRank: player.metadata.gremioRank,
      skills: player.metadata.skills,
      equipment: this.getEquipment(playerId)
    };
  }

  kill(playerId: string, targetName: string): { success: boolean; message: string; combatLog?: string[] } {
    const player = this.engine.entities.getPlayer(playerId);
    if (!player) return { success: false, message: 'Jugador no encontrado.' };

    const room = this.engine.entities.getRoom(player.roomId);
    if (!room) return { success: false, message: 'Sala no encontrada.' };

    const target = room.entities
      .map(id => this.engine.entities.getNPC(id))
      .filter(npc => !!npc && this.matchEntityName(npc.name, targetName))[0];

    if (!target) return { success: false, message: `No ves a ningún "${targetName}" aquí.` };

    if (target.behaviorId !== 'hostile_beast' && target.behaviorId !== 'hostile_boss') {
      return { success: false, message: `¡No puedes atacar a ${target.name}! No es hostil.` };
    }

    const enemies = [target.id];

    // Check for social NPCs
    if (target.flags?.includes('social')) {
      const npcsInRoom = this.engine.entities.getNPCsInRoom(player.roomId);
      npcsInRoom.forEach(npc => {
        if (npc.id !== target.id && npc.flags?.includes('social') && npc.name === target.name) {
          enemies.push(npc.id);
        }
      });
    }

    const combatId = this.engine.initiateCombat([playerId], enemies);
    const combat = this.engine.getActiveCombat(combatId);
    
    if (!combat) return { success: false, message: 'Error iniciando combate.' };

    const combatLog: string[] = [];
    combatLog.push(`<red>¡Te lanzas al combate contra ${target.name}!</red>`);

    // The GameEngine tick will process the rest
    return { success: true, message: 'Combate iniciado.', combatLog };
  }

  talk(playerId: string, targetName: string): { success: boolean; message: string; data?: any } {
    const player = this.engine.entities.getPlayer(playerId);
    if (!player) return { success: false, message: 'Jugador no encontrado.' };

    const room = this.engine.entities.getRoom(player.roomId);
    if (!room) return { success: false, message: 'Sala no encontrada.' };

    const target = room.entities
      .map(id => this.engine.entities.getNPC(id))
      .filter(npc => !!npc && this.matchEntityName(npc.name, targetName))[0];

    if (!target) return { success: false, message: `No ves a ningún "${targetName}" con quien hablar.` };

    if (target.behaviorId === 'hostile_beast' || target.behaviorId === 'hostile_boss') {
      return { success: false, message: `¡${target.name} no parece dispuesto a hablar contigo!` };
    }

    const hasMet = this.engine.checkMemoryFlag(playerId, `met_${target.id}`);
    if (!hasMet) {
      this.engine.setMemoryFlag(playerId, `met_${target.id}`);
    }

    let dialogue = `<cyan>${target.name} te mira.</cyan>\n`;

    // Data-driven dialogue parsing
    const dialogues = target.metadata?.dialogues;
    if (dialogues && Array.isArray(dialogues)) {
      let matchedNode = null;
      
      // Find the first dialogue node whose conditions are met
      for (const node of dialogues) {
        let conditionsMet = true;
        
        if (node.requires_flag && !this.engine.checkMemoryFlag(playerId, node.requires_flag)) {
          conditionsMet = false;
        }
        if (node.requires_not_flag && this.engine.checkMemoryFlag(playerId, node.requires_not_flag)) {
          conditionsMet = false;
        }
        if (node.requires_cronica) {
          const cronicaVal = parseInt(this.engine.getCronica(playerId)?.flags?.[node.requires_cronica.key] || '0');
          if (cronicaVal < node.requires_cronica.min) conditionsMet = false;
        }

        if (conditionsMet) {
          matchedNode = node;
          break;
        }
      }

      if (matchedNode) {
        dialogue += `—${matchedNode.text}\n`;
        
        // Execute side effects
        if (matchedNode.set_flag) {
          this.engine.setMemoryFlag(playerId, matchedNode.set_flag);
        }
        // Could add give_item or assign_quest here later
      } else {
        dialogue += `—Saludos, ${player.name}.\n`;
      }
    } else {
      // Fallback simple dialog
      if (!hasMet) {
        dialogue += `—Saludos, viajero. No creo haberte visto antes por aquí.\n`;
      } else {
        dialogue += `—Nos volvemos a encontrar, ${player.name}.\n`;
      }
    }

    return { success: true, message: dialogue };
  }

  flee(playerId: string): { success: boolean; message: string; combatLog?: string[] } {
    const combat = this.engine.getCombatByPlayerId(playerId);
    if (!combat || !combat.active) {
      return { success: false, message: '¡No estás en combate!' };
    }

    const player = this.engine.entities.getPlayer(playerId);
    if (!player) return { success: false, message: 'Jugador no encontrado.' };

    const room = this.engine.entities.getRoom(player.roomId);
    if (!room || room.exits.length === 0) {
      return { success: false, message: '¡No hay escapatoria! Estás arrinconado.' };
    }

    // Attempt to flee (75% success chance)
    if (Math.random() > 0.75) {
      this.engine.emit('combat_message', playerId, ['\n<red>¡Intentas huir pero tropiezas! El enemigo te bloquea el paso.</red>']);
      return { success: false, message: 'Has fallado al huir.' };
    }

    // Pick a random exit
    const exit = room.exits[Math.floor(Math.random() * room.exits.length)];
    
    // Remove player from combat
    combat.removeParticipant(playerId);
    this.engine.emit('combat_message', playerId, [`\n<yellow>¡Logras escapar del combate hacia el ${exit.direction}!</yellow>`]);
    
    // Execute move
    return this.move(playerId, exit.direction);
  }

  heal(playerId: string): { success: boolean; message: string } {
    const player = this.engine.entities.getPlayer(playerId);
    if (!player) return { success: false, message: 'Jugador no encontrado.' };

    // In a real scenario, we would check energyCurrent. Right now it's calculated.
    // For demo purposes, we will just heal 20 HP.
    const maxHp = StatCalculator.calculate(player).hpMax;
    
    if (player.hpCurrent !== undefined && player.hpCurrent >= maxHp) {
      return { success: false, message: 'Ya tienes la vida al máximo.' };
    }

    const healAmount = 20;
    player.hpCurrent = Math.min((player.hpCurrent || maxHp) + healAmount, maxHp);

    return { success: true, message: `<green>Te concentras y usas tu energía vital. Recuperas ${healAmount} puntos de vida.</green>` };
  }

  // --- Economy Commands ---

  private getMerchantInRoom(room: any, targetName?: string) {
    let npcs = room.entities
      .map((id: string) => this.engine.entities.getNPC(id))
      .filter((npc: any) => !!npc && npc.metadata && npc.metadata.merchant);

    if (targetName) {
      npcs = npcs.filter((npc: any) => this.matchEntityName(npc.name, targetName));
    }
    return npcs[0];
  }

  list(playerId: string, targetName?: string): { success: boolean; message: string; data?: any } {
    const player = this.engine.entities.getPlayer(playerId);
    if (!player) return { success: false, message: 'Jugador no encontrado.' };

    const room = this.engine.entities.getRoom(player.roomId);
    if (!room) return { success: false, message: 'Sala no encontrada.' };

    const merchant = this.getMerchantInRoom(room, targetName);
    if (!merchant) return { success: false, message: targetName ? `No ves a ningún mercader llamado "${targetName}" aquí.` : 'No hay ningún mercader aquí.' };

    const stock = merchant.metadata.inventory || [];
    if (stock.length === 0) return { success: true, message: `${merchant.name} no tiene nada a la venta en este momento.` };

    let msg = `<b>${merchant.name} ofrece los siguientes artículos:</b>\n`;
    stock.forEach((itemId: string) => {
      const itemInst = this.engine.entities.getItem(itemId);
      if (itemInst) {
        msg += ` - <magenta>${itemInst.name}</magenta> : <yellow>${itemInst.value || 10} soles</yellow>\n`;
      }
    });

    return { success: true, message: msg };
  }

  buy(playerId: string, itemName: string, targetName?: string): { success: boolean; message: string } {
    const player = this.engine.entities.getPlayer(playerId);
    if (!player) return { success: false, message: 'Jugador no encontrado.' };

    const room = this.engine.entities.getRoom(player.roomId);
    if (!room) return { success: false, message: 'Sala no encontrada.' };

    const merchant = this.getMerchantInRoom(room, targetName);
    if (!merchant) return { success: false, message: 'No hay mercaderes aquí.' };

    const stock = merchant.metadata.inventory || [];
    const itemInst = stock.map((id: string) => this.engine.entities.getItem(id)).find((i: any) => i && this.matchEntityName(i.name, itemName));

    if (!itemInst) return { success: false, message: `${merchant.name} no vende eso.` };

    const price = itemInst.value || 10;
    if ((player.coins || 0) < price) {
      return { success: false, message: `No tienes suficientes soles. Cuesta ${price}.` };
    }

    // Deduct coins
    player.coins = (player.coins || 0) - price;

    // Create a clone of the item for the player
    const newItem = new Item(itemInst.name, itemInst.description, itemInst.type, itemInst.id + '_' + Date.now());
    newItem.value = itemInst.value;
    newItem.equipSlot = itemInst.equipSlot;
    newItem.metadata = { ...itemInst.metadata };
    
    this.engine.registerItem(newItem);
    player.inventory.push(newItem.id);

    this.engine.savePlayer(playerId);
    return { success: true, message: `Has comprado <magenta>${itemInst.name}</magenta> por <yellow>${price} soles</yellow>.` };
  }

  sell(playerId: string, itemName: string, targetName?: string): { success: boolean; message: string } {
    const player = this.engine.entities.getPlayer(playerId);
    if (!player) return { success: false, message: 'Jugador no encontrado.' };

    const room = this.engine.entities.getRoom(player.roomId);
    if (!room) return { success: false, message: 'Sala no encontrada.' };

    const merchant = this.getMerchantInRoom(room, targetName);
    if (!merchant) return { success: false, message: 'No hay mercaderes aquí.' };

    const itemIndex = player.inventory.findIndex(id => {
      const i = this.engine.entities.getItem(id);
      return i && this.matchEntityName(i.name, itemName);
    });

    if (itemIndex === -1) return { success: false, message: `No tienes eso en tu inventario.` };

    const itemId = player.inventory[itemIndex];
    const itemInst = this.engine.entities.getItem(itemId);
    
    // Sell price is 50%
    const sellPrice = Math.floor((itemInst?.value || 10) * 0.5);
    
    player.inventory.splice(itemIndex, 1);
    this.engine.entities.removeItem(itemId); // Remove from world
    
    player.coins = (player.coins || 0) + sellPrice;

    this.engine.savePlayer(playerId);
    return { success: true, message: `Has vendido <magenta>${itemInst?.name}</magenta> por <yellow>${sellPrice} soles</yellow>.` };
  }

  // --- Skills Commands ---

  getSkills(playerId: string): { success: boolean; message: string; data?: any } {
    const player = this.engine.entities.getPlayer(playerId);
    if (!player) return { success: false, message: 'Jugador no encontrado.' };

    const playerSkills = player.metadata.skills || [];
    if (playerSkills.length === 0) {
      return { success: true, message: 'Aún no conoces ninguna habilidad.' };
    }

    let msg = `<b>Tus habilidades:</b>\n`;
    playerSkills.forEach((skillId: string) => {
      const skillDef = this.engine.skills.getSkill(skillId);
      if (skillDef) {
        msg += ` - <cyan>${skillDef.name}</cyan> [${skillDef.energyCost} EN]: ${skillDef.description}\n`;
      }
    });

    return { success: true, message: msg };
  }

  cast(playerId: string, skillName: string, targetName?: string): { success: boolean; message: string; combatLog?: string[] } {
    const player = this.engine.entities.getPlayer(playerId);
    if (!player) return { success: false, message: 'Jugador no encontrado.' };

    const playerSkills = player.metadata.skills || [];
    const skillDef = this.engine.skills.getSkill(skillName);

    if (!skillDef) return { success: false, message: `No existe la habilidad "${skillName}".` };
    if (!playerSkills.includes(skillDef.id)) return { success: false, message: `No conoces la habilidad "${skillDef.name}".` };

    return this.engine.skills.getSkill(skillDef.id)!.execute(this.engine, playerId, targetName);
  }
}
