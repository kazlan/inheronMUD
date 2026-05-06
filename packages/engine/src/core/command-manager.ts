import { GameEngine } from './game-engine';
import { Item } from '../models/item.model';
import { StatCalculator } from './stat-calculator';

export class CommandManager {
  constructor(private engine: GameEngine) {}

  admin(playerId: string, cmd: string, args: string[]): { success: boolean; message: string; data?: any } {
    const player = this.engine.entities.getPlayer(playerId);
    if (!player) return { success: false, message: 'Jugador no encontrado.' };

    const isAdmin = player.role === 'ADMIN' || player.name.toLowerCase() === 'perseo';
    if (!isAdmin) return { success: false, message: 'No tienes permisos para realizar comandos administrativos.' };

    const ADMIN_SUBCOMMANDS = ['goto', 'summon', 'set-flag', 'give', 'spawn', 'player', 'room', 'refresh', 'set-level', 'invul'];
    let resolvedSub = cmd?.toLowerCase();

    if (resolvedSub && !ADMIN_SUBCOMMANDS.includes(resolvedSub)) {
      const match = ADMIN_SUBCOMMANDS.find(s => s.startsWith(resolvedSub));
      if (match) resolvedSub = match;
    }

    switch (resolvedSub) {
      case 'goto':
        return this.engine.admin.goto(playerId, args[0]);
      case 'summon':
        return this.engine.admin.summon(playerId, args[0]);
      case 'set-flag':
        return this.engine.admin.setFlag(playerId, args[0], args[1]);
      case 'give':
        return this.engine.admin.giveItem(playerId, args[0]);
      case 'spawn':
        return this.engine.admin.spawn(playerId, args[0]);
      case 'player':
        const pData = this.engine.admin.debugPlayer(args[0] || playerId);
        if (pData.error) return { success: false, message: pData.error };
        let pMsg = `<cyan><b>[ DEBUG JUGADOR: ${pData.name} ]</b></cyan>\n`;
        pMsg += `- ID: ${pData.id}\n- Sala: ${pData.roomId}\n- Nivel: ${pData.level}\n- HP: ${pData.hp}\n- Invul: ${pData.invul ? 'SÍ' : 'NO'}\n`;
        pMsg += `- Stats: ${JSON.stringify(pData.stats)}\n`;
        pMsg += `- Flags: ${pData.flags.join(', ') || 'ninguna'}\n`;
        return { success: true, message: pMsg, data: pData };
      case 'room':
        const rData = this.engine.admin.inspectRoom(playerId);
        if (rData.error) return { success: false, message: rData.error };
        let rMsg = `<cyan><b>[ INSPECCIÓN DE SALA: ${rData.name} ]</b></cyan>\n`;
        rMsg += `- ID: ${rData.id} | Área: ${rData.area}\n`;
        rMsg += `- Exits: ${rData.exits.map((e: any) => e.direction).join(', ') || 'ninguna'}\n`;
        rMsg += `- Players: ${rData.players_active.map((p: any) => p.name).join(', ') || 'ninguno'}\n`;
        rMsg += `- NPCs: ${rData.npcs_active.map((n: any) => n.name).join(', ') || 'ninguno'}\n`;
        rMsg += `- Scenery: ${rData.scenery_keys.join(', ') || 'ninguno'}\n`;
        return { success: true, message: rMsg, data: rData };
      case 'refresh':
        return this.engine.admin.refresh(playerId, args[0]);
      case 'set-level':
        const level = parseInt(args[0]);
        if (isNaN(level)) return { success: false, message: 'Debes especificar un nivel numérico.' };
        return this.engine.admin.setLevel(playerId, level, args[1]);
      case 'invul':
        const on = args[0] === 'on';
        return this.engine.admin.invul(playerId, on, args[1]);
      default:
        return { success: false, message: `Subcomando admin "${cmd}" no reconocido. (Válidos: ${ADMIN_SUBCOMMANDS.join(', ')})` };
    }
  }

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
        console.log(`[Command:Look] NPC ${npc.name} isMob: ${json.isMob}, behaviorId: ${npc.behaviorId}`);
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
      occupants: occupants,
      areaMap: this.engine.map.getAreaMap(room.areaId || ''),
      visitedRooms: player?.visitedRooms || []
    };
  }

  private getQuestIndicator(playerId: string, npcId: string): string | null {
    if (npcId === 'anciano_sabio') {
      const isDone = this.engine.checkMemoryFlag(playerId, 'quest_lobos_done');
      if (isDone) return null;

      const cronica = this.engine.getCronica(playerId);
      const lobosMuertos = parseInt(cronica?.variables?.['lobos_muertos'] || '0');
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
    if (!player.visitedRooms.includes(targetRoom.id)) {
      player.visitedRooms.push(targetRoom.id);
    }

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

  getPulso(playerId: string, option?: string): { success: boolean; message: string; data?: any; combatLog?: string[] } {
    const recommendations = this.engine.reactiveSkills.getRecommendations(playerId, 6);
    if (recommendations.length === 0) {
      return { success: true, message: "El pulso del combate está en calma." };
    }

    let index = 0;
    if (option && option !== 'list') {
       index = parseInt(option) - 1;
       if (isNaN(index) || index < 0 || index >= recommendations.length) {
         return { success: false, message: "Opción de pulso inválida." };
       }
    } else if (option === 'list') {
        let msg = `<magenta><b>[ PULSO DE COMBATE ]</b></magenta>\nAcciones sugeridas:\n`;
        recommendations.forEach((rec, idx) => {
           msg += ` ${idx + 1}. <yellow>${rec.name}</yellow> - <i>${rec.reason}</i>\n`;
        });
        return { success: true, message: msg, data: recommendations };
    } else {
        // Default to list if not in combat to avoid accidental casts?
        // Wait, if no option, default to index 0.
        index = 0;
    }

    const rec = recommendations[index];
    
    // Find target
    let targetName = '';
    const combat = this.engine.getCombatByPlayerId(playerId);
    if (combat) {
        const enemy = combat.participants.find(p => !p.isPlayer && p.hpCurrent > 0);
        if (enemy) {
            const npc = this.engine.entities.getNPC(enemy.entityId);
            if (npc) targetName = npc.name.split(' ')[0]; // use first word
        }
    } else if (!option) {
       // If not in combat and no option passed, just list
       let msg = `<magenta><b>[ PULSO DE COMBATE ]</b></magenta>\nAcciones sugeridas:\n`;
       recommendations.forEach((rec, idx) => {
          msg += ` ${idx + 1}. <yellow>${rec.name}</yellow> - <i>${rec.reason}</i>\n`;
       });
       return { success: true, message: msg, data: recommendations };
    }

    return this.cast(playerId, rec.skillId, targetName);
  }

  get(playerId: string, itemName: string): { success: boolean; message: string } {
    const player = this.engine.entities.getPlayer(playerId);
    if (!player) return { success: false, message: 'Jugador no encontrado.' };

    const room = this.engine.entities.getRoom(player.roomId);
    if (!room) return { success: false, message: 'Sala no encontrada.' };

    const words = itemName.toLowerCase().trim().split(/\s+/);
    const isAll = words[0] === 'todo' || words[0] === 'all' || words[0] === '.';

    if (isAll) {
      const filterWord = words.slice(1).join(' ');
      let itemsToPick = room.entities
        .map(id => this.engine.entities.getItem(id))
        .filter((i): i is Item => !!i);

      if (filterWord) {
        const possibleContainer = itemsToPick.find(i => this.matchEntityName(i.name, filterWord) && Array.isArray(i.metadata?.inventory));
        if (possibleContainer) {
          itemsToPick = possibleContainer.metadata.inventory
            .map((id: string) => this.engine.entities.getItem(id))
            .filter((i: any): i is Item => !!i);
          possibleContainer.metadata.inventory = [];
        } else {
          itemsToPick = itemsToPick.filter(i => i.name.toLowerCase().startsWith(filterWord) || this.matchEntityName(i.name, filterWord));
        }
      }

      if (itemsToPick.length === 0) {
        return { success: false, message: filterWord ? `No hay nada coincidente con "${filterWord}" para coger.` : 'No hay nada que coger aquí.' };
      }

      const pickedNames: string[] = [];
      itemsToPick.forEach(item => {
        if (room.entities.includes(item.id)) room.removeEntity(item.id);
        player.inventory.push(item.id);
        pickedNames.push(item.name);
      });

      this.engine.savePlayer(playerId);
      return { success: true, message: `Recoges: ${pickedNames.join(', ')}.` };
    }

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

    const room = this.engine.entities.getRoom(player.roomId);

    const words = itemName.toLowerCase().trim().split(/\s+/);
    const isAll = words[0] === 'todo' || words[0] === 'all' || words[0] === '.';

    if (isAll) {
      const filterWord = words.slice(1).join(' ');
      const itemsToDrop = player.inventory.filter(id => {
        const item = this.engine.entities.getItem(id);
        if (!item) return false;
        if (filterWord) {
           return item.name.toLowerCase().startsWith(filterWord) || this.matchEntityName(item.name, filterWord);
        }
        return true;
      });

      if (itemsToDrop.length === 0) {
        return { success: false, message: filterWord ? `No tienes nada que coincida con "${filterWord}".` : 'No tienes nada que soltar.' };
      }

      const droppedNames: string[] = [];
      itemsToDrop.forEach(id => {
        const index = player.inventory.indexOf(id);
        if (index > -1) {
           const itemId = player.inventory.splice(index, 1)[0];
           if (room) room.addEntity(itemId);
           const item = this.engine.entities.getItem(itemId);
           if (item) droppedNames.push(item.name);
        }
      });

      this.engine.savePlayer(playerId);
      return { success: true, message: `Sueltas: ${droppedNames.join(', ')}.` };
    }

    const itemIndex = player.inventory.findIndex(id => {
      const item = this.engine.entities.getItem(id);
      return item && this.matchEntityName(item.name, itemName);
    });

    if (itemIndex === -1) return { success: false, message: `No llevas nada llamado "${itemName}".` };

    const itemId = player.inventory.splice(itemIndex, 1)[0];
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

    if (!itemName || itemName.trim() === '') {
      const eq = this.getEquipment(playerId);
      let msg = `<cyan><b>[ TU EQUIPAMIENTO ]</b></cyan>\n`;
      let hasEquip = false;
      for (const [slot, item] of Object.entries(eq)) {
        if (item) {
          msg += `<b>[${slot.padEnd(8)}]</b> ${(item as any).name}\n`;
          hasEquip = true;
        }
      }
      if (!hasEquip) {
        msg += `No tienes nada equipado.\n`;
      }
      return { success: true, message: msg, data: eq };
    }

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

    const classData = this.engine.classesData.find((c:any) => c.id === player.classId);
    const className = classData ? classData.name : player.classId;

    const raceData = this.engine.racesData.find((r:any) => r.id === player.raceId);
    const raceName = raceData ? raceData.name : player.raceId;

    const derived = StatCalculator.calculate(player);
    const data = {
      name: player.name,
      class: player.classId,
      className,
      race: player.raceId,
      raceName,
      level: player.level,
      experience: player.experience,
      coins: player.coins,
      stats: player.stats,
      derived,
      gremioRank: player.metadata.gremioRank,
      skills: player.metadata.skills,
      promptSettings: player.metadata.promptSettings,
      equipment: this.getEquipment(playerId),
      bardState: player.bardState,
      activeEffects: player.activeEffects
    };

    const formatName = (id: string) => {
      if (!id) return '';
      const specialCases: Record<string, string> = {
        'bardo_cronica_viva': 'Bardo',
        'caballero_alba': 'Caballero del Alba',
        'clerigo_sanador': 'Clérigo Sanador',
        'humano_altherion': 'Humano de Altherion',
        'humano_arvell': 'Humano de Arvell',
      };
      if (specialCases[id]) return specialCases[id];
      return id.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    // Formatted message for the chat
    let message = `<yellow><b>[ FICHA DE PERSONAJE ]</b></yellow>\n`;
    message += `Nombre: <cyan>${player.name}</cyan> (Nivel ${player.level} ${formatName(player.classId)})\n`;
    message += `Raza: ${formatName(player.raceId)} | Monedas: <yellow>${player.coins} soles</yellow>\n`;
    message += `--------------------------------------------------\n`;
    message += `<b>Puntos de Vida:</b> <red>${player.hpCurrent}/${derived.hpMax}</red>\n`;
    const energyLabel = player.classId === 'bardo_cronica_viva' ? 'Voz' : 'Energía Vital';
    message += `<b>${energyLabel}:</b> <green>${player.energyCurrent}/${derived.energyMax}</green>\n`;
    message += `--------------------------------------------------\n`;
    message += `<b>Atributos Base:</b>\n`;
    message += `Fuerza: ${player.stats.fuerza} | Destreza: ${player.stats.destreza} | Const: ${player.stats.constitucion}\n`;
    message += `Ingenio: ${player.stats.ingenio} | Sabiduría: ${player.stats.sabiduria} | Perc: ${player.stats.percepcion}\n`;
    message += `--------------------------------------------------\n`;
    
    if (player.bardState) {
      message += `<magenta><b>[ ESTADO DE BARDO ]</b></magenta>\n`;
      message += `Aplausos: <yellow>${player.bardState.aplauso || 0}</yellow>\n`;
      message += `Estrofa: ${player.bardState.estrofa || 0}/3 | Trama Máx: ${player.bardState.tramaMax || 1}\n`;
      if (player.bardState.freeSustainAvailable) {
        message += `<green>* ¡Sostener Compás gratuito disponible!</green>\n`;
      }
      message += `--------------------------------------------------\n`;
    }
    
    return { data, message };
  }

  getFormattedCronica(playerId: string): { data: any, message: string } {
    const cronica = this.engine.getCronica(playerId);
    if (!cronica) return { data: null, message: "No tienes una crónica activa." };

    let message = `<magenta><b>[ TU CRÓNICA VIVA ]</b></magenta>\n`;
    const activeQuests = cronica.activeQuests || [];
    
    if (activeQuests.length === 0) {
      message += `Tu diario de aventuras está vacío. Explora el mundo para encontrar misiones.\n`;
    } else {
      message += `Misiones activas (${activeQuests.length}):\n`;
      activeQuests.forEach((q: any) => {
        const status = q.status === 'READY_TO_TURN_IN' ? '<green>[¡LISTA!]</green>' : '[EN CURSO]';
        message += ` - ${status} <yellow>${q.title || q.id}</yellow>\n`;
        if (q.description) message += `   <i>${q.description}</i>\n`;
      });
    }

    message += `--------------------------------------------------\n`;
    const flags = Object.keys(cronica.flags || {});
    if (flags.length > 0) {
      message += `<b>Hitos recordados:</b> ${flags.join(', ').replace(/_/g, ' ')}\n`;
    }

    return { data: cronica, message };
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
    if ((target.hpCurrent ?? 0) <= 0) return { success: false, message: `${target.name} ya está muerto.` };

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
          const cronica = this.engine.getCronica(playerId);
          const cronicaVal = parseInt(cronica?.variables?.[node.requires_cronica.key] || '0');
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
    const newHP = Math.min((player.hpCurrent || maxHp) + healAmount, maxHp);
    this.engine.updateEntityHP(playerId, newHP);

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

  getSkills(playerId: string, query?: string): { success: boolean; message: string; data?: any } {
    const player = this.engine.entities.getPlayer(playerId);
    if (!player) return { success: false, message: 'Jugador no encontrado.' };

    const playerSkills = player.metadata.skills || [];
    if (playerSkills.length === 0) {
      return { success: true, message: 'Aún no conoces ninguna habilidad.' };
    }

    if (query && query.trim() !== '') {
      const qLower = query.toLowerCase().trim();
      let foundDef = null;
      for (const id of playerSkills) {
        const def = this.engine.skills.getSkill(id);
        if (def && (def.name.toLowerCase().startsWith(qLower) || def.id.toLowerCase().startsWith(qLower))) {
          foundDef = def;
          break;
        }
      }

      if (!foundDef) {
        return { success: false, message: `No conoces ninguna habilidad que coincida con "${query}".` };
      }

      let exhaustiveMsg = `<magenta><b>=== ${foundDef.name.toUpperCase()} ===</b></magenta>\n`;
      if (foundDef.family) exhaustiveMsg += `<i>Familia: ${foundDef.family}</i>\n`;
      exhaustiveMsg += `<b>Tipo:</b> ${foundDef.type === 'damage' ? 'Ofensiva' : foundDef.type === 'heal' ? 'Curación' : 'Utilidad'}\n`;
      exhaustiveMsg += `<b>Coste de Energía:</b> <yellow>${foundDef.energyCost} EN</yellow>\n`;
      exhaustiveMsg += `\n<white>${foundDef.description}</white>\n`;
      
      if (foundDef.effects && foundDef.effects.length > 0) {
        exhaustiveMsg += `\n<b>Efectos mecánicos:</b>\n`;
        foundDef.effects.forEach((eff: any) => {
          if (eff.type === 'damage') {
            const dice = (eff.diceCount && eff.diceSides) ? `${eff.diceCount}d${eff.diceSides}` : '';
            const mod = eff.modifier ? `+${eff.modifier}` : '';
            exhaustiveMsg += ` - Inflige <red>${dice}${mod} daño</red>.\n`;
          } else if (eff.type === 'heal') {
            const dice = (eff.diceCount && eff.diceSides) ? `${eff.diceCount}d${eff.diceSides}` : '';
            const mod = eff.modifier ? `+${eff.modifier}` : '';
            exhaustiveMsg += ` - Sana <green>${dice}${mod} HP</green>.\n`;
          }
        });
      }

      return { success: true, message: exhaustiveMsg };
    }

    let msg = `<b>Tus habilidades:</b>\n`;
    playerSkills.forEach((skillId: string) => {
      const skillDef = this.engine.skills.getSkill(skillId);
      if (skillDef) {
        msg += ` - <cyan>${skillDef.name}</cyan> [${skillDef.energyCost} EN]: <i>${skillDef.description.split('.')[0]}</i>.\n`;
      }
    });

    return { success: true, message: msg };
  }

  cast(playerId: string, skillName: string, targetName?: string): { success: boolean; message: string; combatLog?: string[] } {
    const player = this.engine.entities.getPlayer(playerId);
    if (!player) return { success: false, message: 'Jugador no encontrado.' };

    const playerSkills = player.metadata.skills || [];
    let resolvedSkillDef = null;

    for (const id of playerSkills) {
      const def = this.engine.skills.getSkill(id);
      if (def) {
        const nameLower = def.name.toLowerCase();
        const idLower = def.id.toLowerCase();
        const qLower = skillName.toLowerCase();
        
        if (nameLower === qLower || idLower === qLower || nameLower.startsWith(qLower) || idLower.startsWith(qLower)) {
          resolvedSkillDef = def;
          break;
        }
      }
    }

    if (!resolvedSkillDef) return { success: false, message: `No conoces ninguna habilidad que coincida con "${skillName}".` };

    return this.engine.skills.getSkill(resolvedSkillDef.id)!.execute(this.engine, playerId, targetName);
  }

  prompt(playerId: string, args: string[]): { success: boolean; message: string } {
    const player = this.engine.entities.getPlayer(playerId);
    if (!player) return { success: false, message: 'Jugador no encontrado.' };

    if (!player.metadata.promptSettings) {
      player.metadata.promptSettings = { hp: true, resource: true, trama: true, aplauso: true, emoji: true };
    }

    if (args.length === 0) {
      const p = player.metadata.promptSettings;
      let msg = `<cyan><b>Configuración de tu Prompt:</b></cyan>\n`;
      msg += `  hp       : ${p.hp ? '<green>ON</green>' : '<red>OFF</red>'}\n`;
      msg += `  voz/en   : ${p.resource ? '<green>ON</green>' : '<red>OFF</red>'}\n`;
      msg += `  trama    : ${p.trama ? '<green>ON</green>' : '<red>OFF</red>'}\n`;
      msg += `  aplauso  : ${p.aplauso ? '<green>ON</green>' : '<red>OFF</red>'}\n`;
      msg += `  emoji    : ${p.emoji ? '<green>ON</green>' : '<red>OFF</red>'}\n`;
      msg += `\nUso: <yellow>prompt [opción] [on|off]</yellow>\nEjemplo: prompt emoji off`;
      return { success: true, message: msg };
    }

    const option = args[0].toLowerCase();
    const value = args[1]?.toLowerCase();

    if (!['hp', 'voz', 'en', 'trama', 'aplauso', 'emoji'].includes(option)) {
      return { success: false, message: `Opción inválida. Opciones válidas: hp, voz/en, trama, aplauso, emoji.` };
    }

    if (value !== 'on' && value !== 'off') {
      return { success: false, message: `Debes especificar 'on' o 'off'. Ejemplo: prompt ${option} off` };
    }

    const isOn = value === 'on';
    if (option === 'voz' || option === 'en') {
      player.metadata.promptSettings.resource = isOn;
    } else {
      player.metadata.promptSettings[option] = isOn;
    }

    this.engine.emit('save_player', player);

    return { success: true, message: `Opción de prompt '${option}' configurada a <yellow>${value.toUpperCase()}</yellow>.` };
  }

  who(playerId: string): { success: boolean; message: string } {
    const players = this.engine.entities.getPlayers().filter(p => p.isOnline);
    
    let msg = `<b>[ Jugadores Conectados (${players.length}) ]</b>\n`;
    players.forEach(p => {
      const cls = this.engine.classesData.find(c => c.id === p.classId)?.name || p.classId;
      const race = this.engine.racesData.find(r => r.id === p.raceId)?.name || p.raceId;
      msg += `- <yellow>${p.name}</yellow> [Nivel ${p.level} ${race} ${cls}]\n`;
    });

    return { success: true, message: msg };
  }

  help(playerId: string, topic?: string): { success: boolean; message: string } {
    const player = this.engine.entities.getPlayer(playerId);
    if (!player) return { success: false, message: 'Jugador no encontrado.' };

    if (!topic || topic.trim() === '') {
      let msg = `<cyan><b>[ AYUDA: COMANDOS DISPONIBLES ]</b></cyan>\n`;
      msg += `<b>look / l / mirar</b>   : Observa tu entorno o un objetivo.\n`;
      msg += `<b>move / mover</b>       : Desplázate (n, s, e, o, up, down).\n`;
      msg += `<b>open / abrir</b>       : Abre puertas u objetos.\n`;
      msg += `<b>get / coger</b>        : Recoge un objeto del suelo.\n`;
      msg += `<b>drop / soltar</b>      : Suelta un objeto de tu inventario.\n`;
      msg += `<b>equip / equipo</b>     : Muestra tu equipo o equipa un objeto.\n`;
      msg += `<b>unequip / desequipar</b> : Desequipa un objeto.\n`;
      msg += `<b>use / usar</b>         : Interactúa con objetos o utilízalos.\n`;
      msg += `<b>inventory / i</b>      : Muestra tu inventario.\n`;
      msg += `<b>score / puntuacion</b>   : Muestra tu ficha de personaje.\n`;
      msg += `<b>cronica</b>            : Muestra tu diario de misiones e hitos.\n`;
      msg += `<b>skills / habilidades</b> : Lista o muestra información de habilidades.\n`;
      msg += `<b>cast / lanzar / c</b>    : Usa una habilidad en combate.\n`;
      msg += `<b>heal / curar</b>       : Regenera vida fuera de combate.\n`;
      msg += `<b>pulso / p</b>          : Muestra sugerencias de combate.\n`;
      msg += `<b>kill / matar / k</b>     : Inicia un combate.\n`;
      msg += `<b>flee / huir</b>        : Intenta escapar de un combate.\n`;
      msg += `<b>talk / hablar</b>      : Conversa con los NPCs o toma misiones.\n`;
      msg += `<b>list / listar / buy</b>  : Interactúa con mercaderes para comprar.\n`;
      msg += `<b>sell / vender</b>      : Vende objetos a los mercaderes.\n`;
      msg += `<b>say / decir</b>        : Habla con los que están en la sala.\n`;
      msg += `<b>tell / susurrar</b>    : Habla por privado con alguien.\n`;
      msg += `<b>yell / gritar</b>      : Habla en toda el área.\n`;
      msg += `<b>ooc</b>                : Envía un mensaje a un canal global (Out Of Character).\n`;
      msg += `<b>prompt</b>             : Configura la barra de estado.\n`;
      msg += `<b>who</b>                : Muestra los jugadores conectados.\n`;
      msg += `<b>slot <1-10> <cmd></b> : Configura tu barra de habilidades.\n`;
      msg += `<b>help / ayuda <item></b>: Muestra ayuda o detalles de un objeto.\n`;
      
      const isAdmin = player.role === 'ADMIN' || player.name.toLowerCase() === 'perseo';
      if (isAdmin) {
        msg += `<red><b>admin</b></red>            : Comandos de administración.\n`;
      }
      return { success: true, message: msg };
    }

    // Check commands first
    const cmdTopic = topic.toLowerCase().trim();
    const normalizedTopic = cmdTopic.replace(/\s+/g, '_');
    
    // Check in YAML helpData
    let helpContent = this.engine.helpData[cmdTopic] || this.engine.helpData[normalizedTopic];

    if (helpContent) {
      // Special case for admin permissions
      if (cmdTopic === 'admin') {
        const isAdmin = player.role === 'ADMIN' || player.name.toLowerCase() === 'perseo';
        if (!isAdmin) return { success: false, message: 'No tienes permisos para ver esta ayuda.' };
      }

      let msg = `<cyan><b>[ AYUDA DEL COMANDO: ${cmdTopic.toUpperCase()} ]</b></cyan>\n`;
      msg += helpContent;
      return { success: true, message: msg };
    }

    // Check Skills
    let resolvedSkillDef = null;
    const knownSkills = player.metadata?.skills || [];
    
    // Exact match or partial match for skills
    for (const skillId of knownSkills) {
      const def = this.engine.skills.getSkill(skillId);
      if (def) {
        const nameLower = def.name.toLowerCase();
        const idLower = def.id.toLowerCase();
        if (nameLower === cmdTopic || idLower === cmdTopic || nameLower.startsWith(cmdTopic)) {
          resolvedSkillDef = def;
          break;
        }
      }
    }

    if (resolvedSkillDef) {
      let msg = `<cyan><b>[ INFO DE HABILIDAD: ${resolvedSkillDef.name} ]</b></cyan>\n`;
      msg += `Descripción: ${resolvedSkillDef.description}\n`;
      if (resolvedSkillDef.energyCost) msg += `Coste de Energía/Voz: <yellow>${resolvedSkillDef.energyCost}</yellow>\n`;
      msg += `Tipo: ${(resolvedSkillDef as any).isReactive ? 'Reactiva/Táctica' : 'Activa'}\n`;
      // Check for bard specific tags
      if ((resolvedSkillDef as any).family) {
        msg += `Familia (Armonía): <magenta>${(resolvedSkillDef as any).family}</magenta>\n`;
      }
      return { success: true, message: msg };
    }

    // Attempt to inspect an item (either in inventory or in room)
    const room = this.engine.entities.getRoom(player.roomId);
    let targetItem = null;

    // Check inventory
    for (const id of player.inventory) {
      const item = this.engine.entities.getItem(id);
      if (item && this.matchEntityName(item.name, topic)) {
        targetItem = item;
        break;
      }
    }

    // Check room if not found in inventory
    if (!targetItem && room) {
      for (const id of room.entities) {
        const item = this.engine.entities.getItem(id);
        if (item && this.matchEntityName(item.name, topic)) {
          targetItem = item;
          break;
        }
      }
    }

    if (targetItem) {
      let msg = `<cyan><b>[ INFO DEL OBJETO: ${targetItem.name} ]</b></cyan>\n`;
      msg += `Descripción: ${targetItem.description}\n`;
      msg += `Tipo: <yellow>${targetItem.type}</yellow>\n`;
      if (targetItem.value) msg += `Valor: <green>${targetItem.value} monedas</green>\n`;
      if (targetItem.equipSlot) msg += `Ranura de Equipo: <b>${targetItem.equipSlot}</b>\n`;
      
      if (targetItem.metadata) {
        if (targetItem.metadata.diceCount && targetItem.metadata.diceSides) {
          msg += `Daño de Arma: <b>${targetItem.metadata.diceCount}d${targetItem.metadata.diceSides} + ${targetItem.metadata.modifier || 0}</b>\n`;
        }
        if (targetItem.metadata.charges !== undefined) {
          msg += `Cargas restantes: <b>${targetItem.metadata.charges}</b>\n`;
        }
        if (targetItem.metadata.effects) {
          msg += `<i>Posee efectos especiales al usarse/equiparse.</i>\n`;
        }
      }
      return { success: true, message: msg };
    }

    return { success: false, message: `No se encontró ayuda sobre "${topic}". (Si es un objeto, asegúrate de llevarlo encima o que esté en la sala).` };
  }
}
