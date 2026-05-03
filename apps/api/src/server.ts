import Fastify from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import { GameEngine, WorldFactory, CharacterCreator, Database, Player } from 'engine';
import * as fs from 'fs';
import * as path from 'path';

// Crash Logging Setup (DevOpsMaster)
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

function logCrash(err: Error, type: string) {
  const timestamp = new Date().toISOString();
  const logMessage = `\n--- CRASH: ${type} at ${timestamp} ---\n${err.stack || err.message}\n`;
  fs.appendFileSync(path.join(logsDir, 'crash.log'), logMessage);
  console.error(`[Faro] Sistema crítico detectado (${type}). Revisa logs/crash.log`);
}

process.on('uncaughtException', (err) => {
  logCrash(err, 'Uncaught Exception');
  process.exit(1);
});

process.on('unhandledRejection', (reason: any) => {
  const err = reason instanceof Error ? reason : new Error(String(reason));
  logCrash(err, 'Unhandled Rejection');
  process.exit(1);
});

const fastify = Fastify({ logger: true });
fastify.register(fastifyWebsocket);

// Initialize Engine
const engine = new GameEngine();
WorldFactory.populate(engine);
WorldFactory.watchAllData(engine);

let mainPlayer: Player;
const activeSockets = new Map<string, any>();

// Event listeners for async push
engine.on('combat_message', (playerId: string, log: string[]) => {
  const socket = activeSockets.get(playerId);
  if (socket) {
    socket.send(JSON.stringify({
      type: 'COMBAT_UPDATE',
      combatLog: log
    }));
  }
});

const start = async () => {
  try {
    // 1. Try to load player from Database
    const dbData = await Database.loadPlayer('live_user_id');
    
    if (dbData) {
      // Reconstruct Player model
      mainPlayer = new Player(
        dbData.accountId,
        dbData.name,
        dbData.stats,
        dbData.classId,
        dbData.raceId,
        dbData.roomId,
        dbData.id
      );
      mainPlayer.hpCurrent = dbData.hpCurrent;
      mainPlayer.inventory = dbData.inventory;
      console.log(`[Persistence] Jugador cargado de SQLite: ${mainPlayer.name} (HP: ${mainPlayer.hpCurrent})`);
    } else {
      // 2. Create and Save if missing
      mainPlayer = CharacterCreator.create({
        accountId: 'live_user',
        name: 'Aventurero',
        raceId: 'humano_altherion',
        classId: 'caballero_alba',
        distributedPoints: { fuerza: 2, constitucion: 2, presencia: 2 },
        startingRoomId: 'villaclara_plaza',
        id: 'live_user_id'
      });
      await Database.savePlayer(mainPlayer);
      console.log(`[Persistence] Nuevo jugador guardado en SQLite: ${mainPlayer.name}`);
    }

    engine.entities.registerPlayer(mainPlayer);
    engine.startTick(2000); // Start async combat ticks

    await fastify.listen({ port: 4001, host: '0.0.0.0' });
    console.log('--- InheronMUD API Live at ws://localhost:4001/ws ---');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

fastify.register(async (fastify) => {
  fastify.get('/ws', { websocket: true }, (socket, req) => {
    fastify.log.info('Client connected to WebSocket');
    
    // Track connection
    activeSockets.set(mainPlayer.id, socket);

    // Send initial state
    const initialState = engine.commands.look(mainPlayer.id);
    socket.send(JSON.stringify({
      type: 'INIT',
      message: `¡Bienvenido a InheronMUD, ${mainPlayer.name}!`,
      data: initialState
    }));

    socket.on('message', (message: any) => {
      try {
        const payload = JSON.parse(message.toString());
        const { command, args } = payload;

        fastify.log.info(`Command received: ${command} ${args?.join(' ')}`);

        let response: any = { success: false, message: 'Comando no reconocido.' };

        // Direction mapping
        const directions: Record<string, string> = {
          n: 'north', s: 'south', e: 'east', o: 'west', w: 'west', u: 'up', d: 'down',
          ne: 'northeast', nw: 'northwest', se: 'southeast', sw: 'southwest',
          norte: 'north', sur: 'south', este: 'east', oeste: 'west',
          north: 'north', south: 'south', east: 'east', west: 'west', up: 'up', down: 'down',
          northeast: 'northeast', northwest: 'northwest', southeast: 'southeast', southwest: 'southwest'
        };

        if (command === 'look' || command === 'l') {
          response = { success: true, data: engine.commands.look(mainPlayer.id) };
        } else if (command === 'move' || directions[command]) {
          const dir = directions[command] || args[0];
          const moveRes = engine.commands.move(mainPlayer.id, dir);
          response = { ...moveRes, command, data: moveRes.success ? engine.commands.look(mainPlayer.id) : null };
        } else if (command === 'cronica') {
          response = { success: true, data: engine.getCronica(mainPlayer.id) };
        } else if (command === 'get' || command === 'coger') {
          response = engine.commands.get(mainPlayer.id, args.join(' '));
        } else if (command === 'drop' || command === 'soltar') {
          response = engine.commands.drop(mainPlayer.id, args.join(' '));
        } else if (command === 'inventory' || command === 'i') {
          response = { success: true, data: engine.commands.getInventory(mainPlayer.id), command: 'inventory' };
        } else if (command === 'score' || command === 'puntuacion') {
          response = { success: true, data: engine.commands.getScore(mainPlayer.id), command: 'score' };
        } else if (command === 'kill' || command === 'matar' || command === 'atacar') {
          response = { ...engine.commands.kill(mainPlayer.id, args.join(' ')), command: 'kill' };
        } else if (command === 'flee' || command === 'huir') {
          const fleeRes = engine.commands.flee(mainPlayer.id);
          response = { ...fleeRes, command: 'flee', data: fleeRes.success ? engine.commands.look(mainPlayer.id) : null };
        } else if (command === 'heal' || command === 'curar') {
          response = { ...engine.commands.heal(mainPlayer.id), command: 'heal' };
        } else if (command === 'equip' || command === 'equipar') {
          response = { ...engine.commands.equip(mainPlayer.id, args.join(' ')), command: 'equip' };
        } else if (command === 'unequip' || command === 'desequipar') {
          response = { ...engine.commands.unequip(mainPlayer.id, args.join(' ')), command: 'unequip' };
        } else if (command === 'talk' || command === 'hablar' || command === 'ask') {
          response = { ...engine.commands.talk(mainPlayer.id, args.join(' ')), command: 'talk' };
        } else if (command === 'list' || command === 'comprar' || command === 'tienda') {
          // Si no hay args, asumimos list
          if (command === 'list' || args.length === 0) {
            response = { ...engine.commands.list(mainPlayer.id, args.join(' ')), command: 'list' };
          } else {
            response = { ...engine.commands.buy(mainPlayer.id, args.join(' ')), command: 'buy' };
          }
        } else if (command === 'buy') {
          response = { ...engine.commands.buy(mainPlayer.id, args.join(' ')), command: 'buy' };
        } else if (command === 'sell' || command === 'vender') {
          response = { ...engine.commands.sell(mainPlayer.id, args.join(' ')), command: 'sell' };
        }

        socket.send(JSON.stringify({
          type: 'RESPONSE',
          command,
          ...response
        }));
      } catch (err) {
        socket.send(JSON.stringify({ type: 'ERROR', message: 'Error procesando comando.' }));
      }
    });

    socket.on('close', () => {
      fastify.log.info('Client disconnected');
      activeSockets.delete(mainPlayer.id);
      Database.savePlayer(mainPlayer).catch(console.error); // Save on disconnect
    });
  });
});
