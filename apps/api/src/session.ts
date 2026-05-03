import { GameEngine, Database, Player } from 'engine';

export enum SessionState {
  AWAITING_USERNAME,
  AWAITING_PASSWORD,
  AWAITING_NEW_PASSWORD,
  CHARACTER_SELECTION,
  CHARACTER_CREATION_RACE,
  CHARACTER_CREATION_CLASS,
  CHARACTER_CREATION_STATS,
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
        this.handleCreationClass(text);
        break;
      case SessionState.CHARACTER_CREATION_STATS:
        await this.handleCreationStats(text);
        break;
      case SessionState.IN_GAME:
        this.handleGameCommand(text);
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
      this.sendSystemMessage(`Nombre fijado: ${text}.\nElige una Raza (ej. humano_altherion, humano_arvell, drakonita, saurio, elfo):`);
    }
  }

  private handleCreationRace(text: string) {
    // Basic validation could be here
    this.creationData.raceId = text;
    this.state = SessionState.CHARACTER_CREATION_CLASS;
    this.sendSystemMessage(`Raza fijada: ${text}.\nElige una Clase (ej. caballero_alba, monje_candaluz, clerigo_sol_quieto):`);
  }

  private handleCreationClass(text: string) {
    this.creationData.classId = text;
    this.state = SessionState.CHARACTER_CREATION_STATS;
    this.sendSystemMessage(`Clase fijada: ${text}.\nTienes 6 puntos para repartir (FUE DES CON ING SAB PRE PER). Ejemplo: FUE:2 CON:2 PRE:2. Escribe 'auto' para reparto por defecto.`);
  }

  private async handleCreationStats(text: string) {
    // Simplified stat parsing for now
    const baseStats = { fuerza: 5, destreza: 5, constitucion: 5, ingenio: 5, sabiduria: 5, presencia: 5, percepcion: 5 };
    
    if (text.toLowerCase() !== 'auto') {
      // Very crude parse logic: FUE:2
      const parts = text.split(' ');
      parts.forEach(p => {
        const [stat, val] = p.split(':');
        if (stat && val && !isNaN(parseInt(val))) {
          const map: any = { FUE: 'fuerza', DES: 'destreza', CON: 'constitucion', ING: 'ingenio', SAB: 'sabiduria', PRE: 'presencia', PER: 'percepcion' };
          if (map[stat]) {
            baseStats[map[stat] as keyof typeof baseStats] += parseInt(val);
          }
        }
      });
    } else {
      baseStats.fuerza += 2;
      baseStats.constitucion += 2;
      baseStats.presencia += 2;
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
    newPlayer.metadata = { skills: ['tajo_juramentado', 'palma_serena'] }; // Add default skills

    await Database.savePlayer(newPlayer);
    this.sendSystemMessage("¡Personaje creado exitosamente!");
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
  }

  private handleGameCommand(text: string) {
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
    }

    this.send(response);
  }
}
