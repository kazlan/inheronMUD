import { GameEngine, Database, Player } from 'engine';

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
    if (account?.password === password || !account?.password) {
      this.sendSystemMessage("Login correcto.");
      await this.showCharacterSelection();
    } else {
      this.sendSystemMessage("Contraseña incorrecta. Inténtalo de nuevo:");
    }
  }

  private async handleAwaitingNewPassword(password: string) {
    const account = await this.prisma.account.create({
      data: { username: this.tempUsername, password }
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
      let msg = "Personajes disponibles:\n";
      players.forEach((p: any, i: number) => {
        msg += `${i + 1}. ${p.name} (Nivel ${p.level})\n`;
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
    
    // Auto calculate stats
    const race = this.engine.racesData.find(r => r.id === this.creationData.raceId);
    
    const baseStats = { fuerza: 5, destreza: 5, constitucion: 5, ingenio: 5, sabiduria: 5, presencia: 5, percepcion: 5 };
    
    // Add Race stats
    if (race && race.baseStats) {
      for (const [key, val] of Object.entries(race.baseStats)) {
        if (key in baseStats) baseStats[key as keyof typeof baseStats] += val as number;
      }
    }
    
    // Add Class stats
    if (cls.baseStats) {
      for (const [key, val] of Object.entries(cls.baseStats)) {
        if (key in baseStats) baseStats[key as keyof typeof baseStats] += val as number;
      }
    }

    const newPlayer = new Player(
      this.accountId!,
      this.creationData.name,
      baseStats,
      this.creationData.classId,
      this.creationData.raceId,
      'villaclara_plaza'
    );
    newPlayer.hpCurrent = 100;
    newPlayer.energyCurrent = 100;
    
    // Assign starting skills from class
    newPlayer.metadata = { skills: [] };
    if (cls.skills) {
       cls.skills.forEach((s: any) => {
         if (s.level === 1) newPlayer.metadata.skills.push(s.skillId);
       });
    }

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
      player.metadata = dbData.metadata;
      
      this.engine.registerPlayer(player);
    }

    this.playerId = id;
    this.state = SessionState.IN_GAME;

    const initialState = this.engine.commands.look(this.playerId);
    this.send({
      type: 'INIT',
      message: `¡Bienvenido de nuevo, ${player.name}!`,
      data: initialState
    });

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
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    let response: any = { success: false, message: 'Comando no reconocido.' };

    const directions: Record<string, string> = {
      n: 'north', s: 'south', e: 'east', o: 'west', w: 'west', u: 'up', d: 'down',
      ne: 'northeast', nw: 'northwest', se: 'southeast', sw: 'southwest',
      norte: 'north', sur: 'south', este: 'east', oeste: 'west',
      north: 'north', south: 'south', east: 'east', west: 'west', up: 'up', down: 'down',
      northeast: 'northeast', northwest: 'northwest', southeast: 'southeast', southwest: 'southwest'
    };

    if (command === 'look' || command === 'l') {
      response = { success: true, data: this.engine.commands.look(this.playerId) };
    } else if (command === 'move' || directions[command]) {
      const dir = directions[command] || args[0];
      const moveRes = this.engine.commands.move(this.playerId, dir);
      response = { ...moveRes, command, data: moveRes.success ? this.engine.commands.look(this.playerId) : null };
    } else if (command === 'cronica') {
      response = { success: true, data: this.engine.getCronica(this.playerId) };
    } else if (command === 'get' || command === 'coger') {
      response = this.engine.commands.get(this.playerId, args.join(' '));
    } else if (command === 'drop' || command === 'soltar') {
      response = this.engine.commands.drop(this.playerId, args.join(' '));
    } else if (command === 'inventory' || command === 'i') {
      response = { success: true, data: this.engine.commands.getInventory(this.playerId), command: 'inventory' };
    } else if (command === 'score' || command === 'puntuacion') {
      response = { success: true, data: this.engine.commands.getScore(this.playerId), command: 'score' };
    } else if (command === 'equip' || command === 'equipar') {
      response = { ...this.engine.commands.equip(this.playerId, args.join(' ')), command: 'equip' };
    } else if (command === 'unequip' || command === 'desequipar') {
      response = { ...this.engine.commands.unequip(this.playerId, args.join(' ')), command: 'unequip' };
    } else if (command === 'kill' || command === 'matar') {
      response = { ...this.engine.commands.kill(this.playerId, args.join(' ')), command: 'kill' };
    } else if (command === 'flee' || command === 'huir') {
      response = { ...this.engine.commands.flee(this.playerId), command: 'flee' };
    } else if (command === 'heal' || command === 'curar') {
      response = { ...this.engine.commands.heal(this.playerId), command: 'heal' };
    } else if (command === 'talk' || command === 'hablar') {
      response = { ...this.engine.commands.talk(this.playerId, args.join(' ')), command: 'talk' };
    } else if (command === 'list' || command === 'comprar' || command === 'tienda') {
      if (command === 'list' || args.length === 0) {
        response = { ...this.engine.commands.list(this.playerId, args.join(' ')), command: 'list' };
      } else {
        response = { ...this.engine.commands.buy(this.playerId, args.join(' ')), command: 'buy' };
      }
    } else if (command === 'buy') {
      response = { ...this.engine.commands.buy(this.playerId, args.join(' ')), command: 'buy' };
    } else if (command === 'sell' || command === 'vender') {
      response = { ...this.engine.commands.sell(this.playerId, args.join(' ')), command: 'sell' };
    } else if (command === 'skills' || command === 'habilidades') {
      response = { ...this.engine.commands.getSkills(this.playerId), command: 'skills' };
    } else if (command === 'cast' || command === 'use' || command === 'usar' || command === 'lanzar') {
      const skillName = args[0];
      const targetName = args.slice(1).join(' ');
      response = { ...this.engine.commands.cast(this.playerId, skillName, targetName), command: 'cast' };
    } else if (command === 'say' || command === 'decir') {
      response = this.engine.chat.say(this.playerId, args.join(' '));
    } else if (command === 'tell' || command === 'susurrar') {
      response = this.engine.chat.tell(this.playerId, args[0], args.slice(1).join(' '));
    } else if (command === 'yell' || command === 'gritar') {
      response = this.engine.chat.yell(this.playerId, args.join(' '));
    } else if (command === 'channel') {
      response = await this.engine.chat.processAdminCommand(this.playerId, args);
    } else if (command === 'chat' || command === 'c') {
      response = await this.engine.chat.channelMessage(this.playerId, args[0], args.slice(1).join(' '));
    }

    this.send(response);
  }
}
