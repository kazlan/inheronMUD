import { GameEngine, Database, Player, Item, CharacterCreator } from 'engine';
import * as bcrypt from 'bcrypt';

export enum SessionState {
  AWAITING_USERNAME,
  AWAITING_PASSWORD,
  AWAITING_NEW_PASSWORD,
  CHARACTER_SELECTION,
  CHARACTER_CREATION_RACE,
  CHARACTER_CREATION_CLASS,
  IN_GAME
}

export class Session {
  public state: SessionState = SessionState.AWAITING_USERNAME;
  public accountId: string | null = null;
  public playerId: string | null = null;
  public socket: any;
  private engine: GameEngine;
  private prisma: any;

  // Creation temp data
  private tempUsername: string = '';
  private creationData: any = {};

  constructor(socket: any, engine: GameEngine) {
    this.socket = socket;
    this.engine = engine;
    this.prisma = Database.getInstance();

    this.sendSystemMessage("Conexión establecida. Introduce tu usuario:");
  }

  public send(payload: any) {
    this.socket.send(JSON.stringify(payload));
  }

  public sendSystemMessage(message: string) {
    this.send({ type: 'SYSTEM', message });
  }

  public async handleMessage(message: string) {
    const text = message.trim();
    if (!text) return;

    switch (this.state) {
      case SessionState.AWAITING_USERNAME:
        await this.handleAwaitingUsername(text);
        break;
      case SessionState.AWAITING_PASSWORD:
        await this.handleAwaitingPassword(text);
        break;
      case SessionState.AWAITING_NEW_PASSWORD:
        await this.handleAwaitingNewPassword(text);
        break;
      case SessionState.CHARACTER_SELECTION:
        await this.handleCharacterSelection(text);
        break;
      case SessionState.CHARACTER_CREATION_RACE:
        this.handleCreationRace(text);
        break;
      case SessionState.CHARACTER_CREATION_CLASS:
        await this.handleCreationClass(text);
        break;
      case SessionState.IN_GAME:
        await this.handleGameCommand(text);
        break;
    }
  }

  private async handleAwaitingUsername(username: string) {
    this.tempUsername = username;
    const account = await this.prisma.account.findUnique({ where: { username } });
    if (account) {
      this.accountId = account.id;
      this.state = SessionState.AWAITING_PASSWORD;
      this.sendSystemMessage(`Usuario '${username}' encontrado. Introduce tu contraseña:`);
    } else {
      this.state = SessionState.AWAITING_NEW_PASSWORD;
      this.sendSystemMessage(`Cuenta nueva. Elige una contraseña para '${username}':`);
    }
  }

  private async handleAwaitingPassword(password: string) {
    const account = await this.prisma.account.findUnique({ where: { id: this.accountId! } });
    
    // For backwards compatibility during migration, we check if the password matches directly (old way)
    // or matches via bcrypt.
    let isMatch = false;
    if (!account?.password) {
      isMatch = true;
    } else {
      isMatch = await bcrypt.compare(password, account.password);
      // Legacy plain text check (remove after full migration)
      if (!isMatch && account.password === password) {
        isMatch = true;
        // Optionally auto-migrate the password here
        const newHash = await bcrypt.hash(password, 10);
        await this.prisma.account.update({ where: { id: this.accountId! }, data: { password: newHash } });
      }
    }

    if (isMatch) {
      this.sendSystemMessage("Login correcto.");
      await this.showCharacterSelection();
    } else {
      this.sendSystemMessage("Contraseña incorrecta. Inténtalo de nuevo:");
    }
  }

  private async handleAwaitingNewPassword(password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const account = await this.prisma.account.create({
      data: { username: this.tempUsername, password: hashedPassword }
    });
    this.accountId = account.id;
    this.sendSystemMessage("Cuenta creada con éxito.");
    await this.showCharacterSelection();
  }

  private async showCharacterSelection() {
    const players = await this.prisma.player.findMany({ where: { accountId: this.accountId! } });
    this.state = SessionState.CHARACTER_SELECTION;

    if (players.length === 0) {
      this.sendSystemMessage("No tienes personajes. Escribe el NOMBRE de tu nuevo personaje:");
      // We hijack selection state for new name if they have 0
    } else {
      let msg = "<b>Personajes disponibles:</b>\n";
      const classColors: Record<string, string> = {
        'bardo_cronica_viva': 'magenta',
        'caballero_alba': 'yellow',
        'clerigo_sol_quieto': 'cyan',
        'inquisidor_llama': 'red',
        'guardian_roca': 'green'
      };

      players.forEach((p: any, i: number) => {
        const color = classColors[p.classId] || 'white';
        msg += `${i + 1}. <${color}>${p.name}</${color}> (Nivel ${p.level})\n`;
      });
      msg += "Escribe el número para entrar, o el nombre para crear uno nuevo.";
      this.sendSystemMessage(msg);
    }
  }

  private async handleCharacterSelection(text: string) {
    const players = await this.prisma.player.findMany({ where: { accountId: this.accountId! } });
    const num = parseInt(text);

    if (!isNaN(num) && num > 0 && num <= players.length) {
      // Login existing
      await this.loginCharacter(players[num - 1].id);
    } else {
      // Create new character with this name
      const exists = await this.prisma.player.findUnique({ where: { name: text } });
      if (exists) {
        this.sendSystemMessage("Ese nombre ya está en uso. Elige otro:");
        return;
      }
      this.creationData.name = text;
      this.state = SessionState.CHARACTER_CREATION_RACE;
      
      const raceIds = this.engine.racesData.map(r => r.id).join(', ');
      this.sendSystemMessage(`Nombre fijado: ${text}.\nElige una Raza (${raceIds}):`);
    }
  }

  private handleCreationRace(text: string) {
    const race = this.engine.racesData.find(r => r.id === text);
    if (!race) {
      this.sendSystemMessage(`Raza no encontrada. Elige una válida (${this.engine.racesData.map(r => r.id).join(', ')}):`);
      return;
    }
    
    this.creationData.raceId = text;
    this.state = SessionState.CHARACTER_CREATION_CLASS;
    
    const classIds = this.engine.classesData.map(c => c.id).join(', ');
    this.sendSystemMessage(`Raza fijada: ${race.name}.\nElige una Clase (${classIds}):`);
  }

  private async handleCreationClass(text: string) {
    const cls = this.engine.classesData.find(c => c.id === text);
    if (!cls) {
      this.sendSystemMessage(`Clase no encontrada. Elige una válida (${this.engine.classesData.map(c => c.id).join(', ')}):`);
      return;
    }

    this.creationData.classId = text;
    
    // Use the engine's CharacterCreator for a consistent character initialization
    const newPlayer = CharacterCreator.create({
      accountId: this.accountId!,
      name: this.creationData.name,
      raceId: this.creationData.raceId,
      classId: this.creationData.classId,
      distributedPoints: {}, // Default stats for now
      startingRoomId: 'villaclara_plaza'
    });

    await Database.savePlayer(newPlayer);
    this.sendSystemMessage("¡Personaje creado exitosamente! Entrando al mundo...");
    await this.loginCharacter(newPlayer.id);
  }

  private async loginCharacter(id: string) {
    const dbData = await Database.loadPlayer(id);
    if (!dbData) return;

    // Load into engine if not present
    let player = this.engine.getPlayer(id);
    if (!player) {
      player = new Player(
        dbData.accountId,
        dbData.name,
        dbData.stats,
        dbData.classId,
        dbData.raceId,
        dbData.roomId,
        dbData.id
      );
      player.hpCurrent = dbData.hpCurrent;
      player.energyCurrent = dbData.energyCurrent;
      player.level = dbData.level;
      player.experience = dbData.experience;
      player.coins = dbData.coins;
      player.inventory = dbData.inventory;
      player.equipment = dbData.equipment;
      player.metadata = dbData.metadata || { skills: [] };

      // Recreate item instances from DB
      const recreatedIds = new Set<string>();
      if (dbData.itemInstances && Array.isArray(dbData.itemInstances)) {
        dbData.itemInstances.forEach((inst: any) => {
          const item = new Item(inst.name, inst.description, inst.type as any, inst.id);
          item.value = inst.value;
          item.equipSlot = inst.equipSlot;
          item.metadata = inst.metadata;
          this.engine.registerItem(item);
          recreatedIds.add(item.id);
        });
      }

      // Legacy Recovery: If an ID in inventory is NOT in the engine and NOT recreated, 
      // try to reconstruct from template.
      const allInventory = [...player.inventory, ...Object.values(player.equipment)];
      for (const id of allInventory) {
        if (!this.engine.entities.getItem(id) && !recreatedIds.has(id)) {
           // Try to find template ID (e.g. "item_pocion_vida_123" -> "item_pocion_vida")
           const templateId = id.split('_').slice(0, -1).join('_') || id.split('_')[0];
           const template = this.engine.entities.itemTemplates.get(templateId);
           if (template) {
             const recovered = new Item(template.name, template.description, template.type as any, id);
             recovered.value = template.value;
             recovered.equipSlot = template.equipSlot;
             recovered.metadata = { ...template.metadata, recovered: true };
             this.engine.registerItem(recovered);
             console.log(`[Recovery] Recovered legacy item ${id} from template ${templateId}`);
           }
        }
      }

      if (!player.metadata.promptSettings) {
        player.metadata.promptSettings = { hp: true, resource: true, trama: true, aplauso: true, emoji: true };
      }
      if (dbData.bardState) player.bardState = dbData.bardState;
      // Also init bardState if it's missing but class is bardo
      if (!player.bardState && player.classId === 'bardo_cronica_viva') {
        player.bardState = { estrofa: 0, aplauso: 0, tramaMax: 1 };
      }
      
      this.engine.registerPlayer(player);
    }

    player.isOnline = true;
    this.playerId = id;
    this.state = SessionState.IN_GAME;

    const initialState = this.engine.commands.look(this.playerId);
    this.send({
      type: 'INIT',
      message: `¡Bienvenido de nuevo, ${player.name}!`,
      data: initialState
    });

    // Send silent initial data sync
    this.send({ type: 'data', group: 'attributes', data: this.engine.commands.getScore(this.playerId).data });
    this.send({ type: 'data', group: 'inventory', data: this.engine.commands.getInventory(this.playerId) });
    this.send({ type: 'data', group: 'equipment', data: this.engine.commands.getEquipment(this.playerId) });
    this.send({ type: 'data', group: 'quests', data: this.engine.commands.getFormattedCronica(this.playerId).data });

    this.engine.emit('spatial_message', {
      roomId: player.roomId,
      message: `<yellow>${player.name} ha entrado al mundo en un destello arcano.</yellow>`,
      excludeId: player.id
    });
  }

  private async handleGameCommand(text: string) {
    if (!this.playerId) return;

    // Route command logic currently in server.ts to here
    const parts = text.trim().split(' ');
    let command = parts[0].toLowerCase();
    const args = parts.slice(1);

    let response: any = { success: false, message: 'Comando no reconocido.' };

    const directions: Record<string, string> = {
      n: 'north', s: 'south', e: 'east', o: 'west', w: 'west', u: 'up', d: 'down',
      ne: 'northeast', nw: 'northwest', se: 'southeast', sw: 'southwest',
      norte: 'north', sur: 'south', este: 'east', oeste: 'west',
      north: 'north', south: 'south', east: 'east', west: 'west', up: 'up', down: 'down',
      northeast: 'northeast', northwest: 'northwest', southeast: 'southeast', southwest: 'southwest'
    };

    const VALID_COMMANDS = [
      'cast', 'c', 'lanzar', 'look', 'mirar', 'l', 'move', 'mover', 'cronica', 'open', 'abrir', 'get', 'coger',
      'drop', 'soltar', 'inventory', 'inventario', 'i', 'score', 'puntuacion', 'equip', 'equipo', 'equipar',
      'help', 'ayuda',
      'unequip', 'desequipar', 'kill', 'matar', 'k', 'flee', 'huir', 'heal', 'curar', 'talk', 'hablar',
      'list', 'listar', 'tienda', 'buy', 'comprar', 'sell', 'vender', 'skills', 'habilidades',
      'use', 'usar', 'interact', 'interactuar', 'tirar', 'say', 'decir',
      'tell', 'susurrar', 'yell', 'gritar', 'channel', 'ooc', 'pulso', 'p', 'prompt', 'who', 'admin'
    ];

    let resolvedCommand = command;
    if (!directions[command]) {
      if (VALID_COMMANDS.includes(command)) {
        resolvedCommand = command;
      } else {
        const matches = VALID_COMMANDS.filter(cmd => cmd.startsWith(command));
        if (matches.length > 0) {
          resolvedCommand = matches[0];
        }
      }
    }
    // Para simplificar, actualizamos command a resolvedCommand
    const originalCommand = command;
    command = resolvedCommand;

    if (command === 'look' || command === 'l') {
      response = { success: true, data: this.engine.commands.look(this.playerId, args.join(' ')), command: 'look' };
    } else if (command === 'move' || directions[command]) {
      const dir = directions[command] || args[0];
      const moveRes = this.engine.commands.move(this.playerId, dir);
      response = { ...moveRes, command, data: moveRes.success ? this.engine.commands.look(this.playerId) : null };
    } else if (command === 'cronica') {
      const res = this.engine.commands.getFormattedCronica(this.playerId);
      response = { success: true, data: res.data, message: res.message, command: 'cronica' };
    } else if (command === 'open' || command === 'abrir') {
      response = { ...this.engine.commands.open(this.playerId, args.join(' ')), command: 'open' };
    } else if (command === 'get' || command === 'coger') {
      response = this.engine.commands.get(this.playerId, args.join(' '));
    } else if (command === 'drop' || command === 'soltar') {
      response = this.engine.commands.drop(this.playerId, args.join(' '));
    } else if (command === 'inventory' || command === 'i') {
      const invData = this.engine.commands.getInventory(this.playerId);
      const items = invData.map(i => `<cyan>${i.name}</cyan>`).join(', ');
      const message = items ? `<b>Tu inventario:</b> ${items}` : `<b>Tu inventario está vacío.</b>`;
      response = { success: true, data: invData, message, command: 'inventory' };
    } else if (command === 'score' || command === 'puntuacion') {
      const res = this.engine.commands.getScore(this.playerId);
      response = { success: true, data: res.data, message: res.message, command: 'score' };
    } else if (command === 'equip' || command === 'equipar' || command === 'equipo') {
      response = { ...this.engine.commands.equip(this.playerId, args.join(' ')), command: 'equip' };
    } else if (command === 'unequip' || command === 'desequipar') {
      response = { ...this.engine.commands.unequip(this.playerId, args.join(' ')), command: 'unequip' };
    } else if (command === 'kill' || command === 'matar' || command === 'k') {
      response = { ...this.engine.commands.kill(this.playerId, args.join(' ')), command: 'kill' };
    } else if (command === 'flee' || command === 'huir') {
      response = { ...this.engine.commands.flee(this.playerId), command: 'flee' };
    } else if (command === 'heal' || command === 'curar') {
      response = { ...this.engine.commands.heal(this.playerId), command: 'heal' };
    } else if (command === 'talk' || command === 'hablar') {
      response = { ...this.engine.commands.talk(this.playerId, args.join(' ')), command: 'talk' };
    } else if (command === 'list' || command === 'listar' || command === 'comprar' || command === 'tienda') {
      if (command === 'list' || command === 'listar' || args.length === 0) {
        response = { ...this.engine.commands.list(this.playerId, args.join(' ')), command: 'list' };
      } else {
        response = { ...this.engine.commands.buy(this.playerId, args.join(' ')), command: 'buy' };
      }
    } else if (command === 'buy') {
      response = { ...this.engine.commands.buy(this.playerId, args.join(' ')), command: 'buy' };
    } else if (command === 'sell' || command === 'vender') {
      response = { ...this.engine.commands.sell(this.playerId, args.join(' ')), command: 'sell' };
    } else if (command === 'skills' || command === 'habilidades') {
      response = { ...this.engine.commands.getSkills(this.playerId, args.join(' ')), command: 'skills' };
    } else if (command === 'cast' || command === 'c' || command === 'lanzar') {
      const skillName = args[0];
      const targetName = args.slice(1).join(' ');
      response = { ...this.engine.commands.cast(this.playerId, skillName, targetName), command: 'cast' };
    } else if (command === 'use' || command === 'usar' || command === 'interact' || command === 'interactuar' || command === 'tirar') {
      const interactRes = this.engine.commands.interact(this.playerId, args.join(' '));
      response = { ...interactRes, command: 'interact' };
      if (interactRes.success) {
         this.send({ type: 'data', group: 'inventory', data: this.engine.commands.getInventory(this.playerId) });
      }
    } else if (command === 'say' || command === 'decir') {
      response = this.engine.chat.say(this.playerId, args.join(' '));
    } else if (command === 'tell' || command === 'susurrar') {
      response = this.engine.chat.tell(this.playerId, args[0], args.slice(1).join(' '));
    } else if (command === 'yell' || command === 'gritar') {
      response = this.engine.chat.yell(this.playerId, args.join(' '));
    } else if (command === 'channel') {
      response = await this.engine.chat.processAdminCommand(this.playerId, args);
    } else if (command === 'ooc') {
      response = await this.engine.chat.channelMessage(this.playerId, 'ooc', args.join(' '));
    } else if (command === 'pulso' || command === 'p') {
      response = { ...this.engine.commands.getPulso(this.playerId, args[0]), command: 'pulso' };
    } else if (command === 'prompt') {
      response = { ...this.engine.commands.prompt(this.playerId, args), command: 'prompt' };
      // Sync attributes back to client so CommandLine updates immediately
      if (response.success) {
        this.send({ type: 'data', group: 'attributes', data: this.engine.commands.getScore(this.playerId).data });
      }
    } else if (command === 'who') {
      response = { ...this.engine.commands.who(this.playerId), command: 'who' };
    } else if (command === 'help' || command === 'ayuda') {
      response = { ...this.engine.commands.help(this.playerId, args.join(' ')), command: 'help' };
    } else if (command === 'admin') {
      const subCommand = args[0];
      const subArgs = args.slice(1);
      response = { ...this.engine.commands.admin(this.playerId, subCommand, subArgs), command: 'admin' };
    } else {
      // Intentar interacción contextual (ej. "empujar piedra")
      const targetStr = args.join(' ');
      if (targetStr) {
        const interactRes = this.engine.commands.interact(this.playerId, targetStr, command);
        if (interactRes.isContextualMatch) {
          response = { ...interactRes, command: 'interact' };
        }
      }
    }

    this.send({
      type: 'RESPONSE',
      ...response
    });
  }
}
