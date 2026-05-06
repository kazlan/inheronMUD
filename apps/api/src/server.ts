import Fastify from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import { GameEngine, WorldFactory, CharacterCreator, Database, Player } from 'engine';
import { Session } from './session';
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

let engineStarted = false;
const activeSessions = new Set<Session>();

// Event listeners for async push
engine.on('combat_message', (playerId: string, log: string[]) => {
  for (const session of activeSessions) {
    if (session.playerId === playerId) {
      const pulse = engine.reactiveSkills.getRecommendations(playerId, 4);
      const combat = engine.getCombatByPlayerId(playerId);
      const targets = combat ? combat.participants.filter(p => !p.isPlayer).map(p => ({
        id: p.entityId,
        name: p.name,
        hpCurrent: p.hpCurrent,
        hpMax: p.hpMax,
        level: p.level,
        activeEffects: p.activeEffects
      })) : [];

      session.send({
        type: 'COMBAT_UPDATE',
        combatLog: log,
        data: targets,
        pulse,
        tickMs: engine.tickMs,
        lastTickTime: engine.lastTickTime
      });
      // Send dynamic attributes update (e.g. HP, Energy, BardState)
      session.send({
        type: 'data',
        group: 'attributes',
        data: engine.commands.getScore(playerId).data
      });
      break;
    }
  }
});

engine.on('combat_ended', (playerId: string) => {
  for (const session of activeSessions) {
    if (session.playerId === playerId) {
      session.send({
        type: 'COMBAT_UPDATE',
        combatLog: [],
        data: [],
        pulse: []
      });
      break;
    }
  }
});

engine.on('save_player', (player: any) => {
  for (const session of activeSessions) {
    if (session.playerId === player.id) {
      session.send({ type: 'data', group: 'attributes', data: engine.commands.getScore(player.id).data });
      session.send({ type: 'data', group: 'inventory', data: engine.commands.getInventory(player.id) });
      session.send({ type: 'data', group: 'equipment', data: engine.commands.getEquipment(player.id) });
      break;
    }
  }
});

engine.on('chat_message', (payload: any) => {
  for (const session of activeSessions) {
    if (!session.playerId) continue;

    if (payload.type === 'say') {
      const player = engine.getPlayer(session.playerId);
      if (player && player.roomId === payload.roomId) {
        session.send({ type: 'CHAT', data: payload });
      }
    } else if (payload.type === 'tell') {
      if (session.playerId === payload.targetId || session.playerId === payload.sourceId) {
        session.send({ type: 'CHAT', data: payload });
      }
    } else if (payload.type === 'yell') {
      session.send({ type: 'CHAT', data: payload });
    } else if (payload.type === 'channel') {
      // Broadcast to all for now (global channels)
      session.send({ type: 'CHAT', data: payload });
    }
  }
});

engine.on('spatial_message', (payload: any) => {
  for (const session of activeSessions) {
    if (!session.playerId) continue;
    if (payload.excludeId && session.playerId === payload.excludeId) continue;

    const player = engine.getPlayer(session.playerId);
    if (player && player.roomId === payload.roomId) {
      session.send({ type: 'SPATIAL', message: payload.message });
    }
  }
});

engine.on('force_look', (playerId: string) => {
  const session = Array.from(activeSessions).find(s => s.playerId === playerId);
  if (session) {
    const res = engine.commands.look(playerId);
    session.send({ type: 'command_result', success: true, command: 'look', data: res });
  }
});

// Debounced saving mechanism
const playerSaveTimeouts = new Map<string, NodeJS.Timeout>();
engine.on('save_player', (player: Player) => {
  if (playerSaveTimeouts.has(player.id)) {
    clearTimeout(playerSaveTimeouts.get(player.id)!);
  }
  const timeoutId = setTimeout(() => {
    // Gather all item entities from inventory and equipment
    const itemEntities: any[] = [];
    
    // Inventory
    player.inventory.forEach(id => {
      const item = engine.entities.getItem(id);
      if (item) itemEntities.push(item);
    });

    // Equipment
    Object.values(player.equipment).forEach(id => {
      const item = engine.entities.getItem(id);
      if (item) itemEntities.push(item);
    });

    const saveData = {
      ...player.toJSON(),
      itemEntities
    };

    Database.savePlayer(saveData).catch(err => console.error(`Error defer-saving player ${player.name}:`, err));
    playerSaveTimeouts.delete(player.id);
  }, 5000); // Debounce for 5 seconds
  playerSaveTimeouts.set(player.id, timeoutId);
});

const start = async () => {
  try {
    // Engine ticks
    engine.startTick(2500);

    await fastify.listen({ port: 4001, host: '0.0.0.0' });
    console.log('--- InheronMUD API Live at ws://localhost:4001/ws ---');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};


fastify.register(async (fastify) => {
  fastify.get('/ws', { websocket: true }, (socket, req) => {
    fastify.log.info('Client connected to WebSocket');
    
    // Create new session
    const session = new Session(socket, engine);
    activeSessions.add(session);

    socket.on('message', async (message: any) => {
      try {
        const payload = JSON.parse(message.toString());
        // For backwards compatibility with the client, we combine command + args into a text line
        // or just let session handle string
        const text = payload.command + (payload.args?.length ? ' ' + payload.args.join(' ') : '');
        await session.handleMessage(text);
      } catch (e: any) {
        fastify.log.error('Error handling message:', e);
      }
    });

    socket.on('close', () => {
      fastify.log.info('Client disconnected');
      activeSessions.delete(session);
      if (session.playerId) {
        const player = engine.getPlayer(session.playerId);
        if (player) {
          player.isOnline = false;
          engine.emit('spatial_message', {
            roomId: player.roomId,
            message: `<yellow>${player.name} desaparece en un haz de luz de desconexión.</yellow>`,
            excludeId: player.id
          });
          Database.savePlayer(player).catch(console.error);
        }
      }
    });
  });
});

// Start the server after all registrations
start();
