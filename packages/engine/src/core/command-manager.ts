import { GameEngine } from './game-engine';
import { Item } from '../models/item.model';
import { StatCalculator } from './stat-calculator';

export class CommandManager {
  constructor(private engine: GameEngine) {}

  look(playerId: string): any {
    const player = this.engine.entities.getPlayer(playerId);
    if (!player) return null;

    const room = this.engine.entities.getRoom(player.roomId);
    if (!room) return null;

    const occupants = room.entities.map(id => {
      const npc = this.engine.entities.getNPC(id);
      const item = this.engine.entities.getItem(id);
      
      if (npc) {
        const json = npc.toJSON() as any;
        json.questIndicator = this.getQuestIndicator(playerId, npc.id);
        json.isMob = npc.behaviorId === 'hostile_beast' || npc.behaviorId === 'hostile_boss';
        json.levelDiff = npc.level - (player?.level || 1);
        return json;
      }
      if (item) return item.toJSON();
      
      return null;
    }).filter(Boolean);

    return {
      room: room.toJSON(),
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

    this.engine.getEventLog().log({
      type: 'PLAYER_MOVED',
      actorId: playerId,
      roomId: targetRoom.id,
      data: { direction, from: currentRoom.id, to: targetRoom.id }
    });

    return { success: true, message: `Te mueves hacia el ${direction}.`, roomId: targetRoom.id };
  }

  get(playerId: string, itemName: string): { success: boolean; message: string } {
    const player = this.engine.entities.getPlayer(playerId);
    if (!player) return { success: false, message: 'Jugador no encontrado.' };

    const room = this.engine.entities.getRoom(player.roomId);
    if (!room) return { success: false, message: 'Sala no encontrada.' };

    const item = room.entities
      .map(id => this.engine.entities.getItem(id))
      .filter((i): i is Item => !!i && i.name.toLowerCase().includes(itemName.toLowerCase()))[0];

    if (!item) return { success: false, message: `No ves ningún "${itemName}" aquí.` };

    room.removeEntity(item.id);
    player.inventory.push(item.id);

    this.engine.getEventLog().log({
      type: 'ITEM_PICKED_UP',
      actorId: playerId,
      data: { itemId: item.id, itemName: item.name }
    });

    return { success: true, message: `Recoges: ${item.name}.` };
  }

  drop(playerId: string, itemName: string): { success: boolean; message: string } {
    const player = this.engine.entities.getPlayer(playerId);
    if (!player) return { success: false, message: 'Jugador no encontrado.' };

    const itemIndex = player.inventory.findIndex(id => {
      const item = this.engine.entities.getItem(id);
      return item && item.name.toLowerCase().includes(itemName.toLowerCase());
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
      return item && item.name.toLowerCase().includes(itemName.toLowerCase());
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
      if (slot.toLowerCase() === slotOrName.toLowerCase() || (item && item.name.toLowerCase().includes(slotOrName.toLowerCase()))) {
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
      .filter(npc => !!npc && npc.name.toLowerCase().includes(targetName.toLowerCase()))[0];

    if (!target) return { success: false, message: `No ves a ningún "${targetName}" aquí.` };

    if (target.behaviorId !== 'hostile_beast' && target.behaviorId !== 'hostile_boss') {
      return { success: false, message: `¡No puedes atacar a ${target.name}! No es hostil.` };
    }

    const combatId = this.engine.initiateCombat([playerId], [target.id]);
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
      .filter(npc => !!npc && npc.name.toLowerCase().includes(targetName.toLowerCase()))[0];

    if (!target) return { success: false, message: `No ves a ningún "${targetName}" con quien hablar.` };

    if (target.behaviorId === 'hostile_beast' || target.behaviorId === 'hostile_boss') {
      return { success: false, message: `¡${target.name} no parece dispuesto a hablar contigo!` };
    }

    // Very simple dialog tree using engine memory flags
    const hasMet = this.engine.checkMemoryFlag(playerId, `met_${target.id}`);
    
    let dialogue = `<cyan>${target.name} te mira.</cyan>\n`;
    if (!hasMet) {
      dialogue += `—Saludos, viajero. No creo haberte visto antes por aquí.\n`;
      this.engine.setMemoryFlag(playerId, `met_${target.id}`);
    } else {
      dialogue += `—Nos volvemos a encontrar, ${player.name}.\n`;
    }

    // Simple quest hook
    if (target.id === 'anciano_sabio') {
      const lobosMuertos = parseInt(this.engine.getCronica(playerId)?.flags?.['lobos_muertos'] || '0');
      if (lobosMuertos >= 3) {
        if (!this.engine.checkMemoryFlag(playerId, 'quest_lobos_done')) {
          dialogue += `—Veo que has acabado con la amenaza de los lobos. Toma esta poción como recompensa.\n`;
          this.engine.setMemoryFlag(playerId, 'quest_lobos_done');
          // Give item logic would go here
        } else {
          dialogue += `—Gracias de nuevo por encargarte de esos lobos.\n`;
        }
      } else {
        dialogue += `—Los lobos del norte están muy agresivos. Si pudieras acabar con 3 de ellos, te recompensaría.\n`;
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
      npcs = npcs.filter((npc: any) => npc.name.toLowerCase().includes(targetName.toLowerCase()));
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
    const itemInst = stock.map((id: string) => this.engine.entities.getItem(id)).find((i: any) => i && i.name.toLowerCase().includes(itemName.toLowerCase()));

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
      return i && i.name.toLowerCase().includes(itemName.toLowerCase());
    });

    if (itemIndex === -1) return { success: false, message: `No tienes eso en tu inventario.` };

    const itemId = player.inventory[itemIndex];
    const itemInst = this.engine.entities.getItem(itemId);
    
    // Sell price is 50%
    const sellPrice = Math.floor((itemInst?.value || 10) * 0.5);
    
    player.inventory.splice(itemIndex, 1);
    this.engine.entities.removeItem(itemId); // Remove from world
    
    player.coins = (player.coins || 0) + sellPrice;

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
