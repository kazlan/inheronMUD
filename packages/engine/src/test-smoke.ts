import { GameEngine } from './core/game-engine';
import { WorldFactory } from './core/world-factory';
import { CharacterCreator } from './core/character-creator';

// Initialize Engine
const engine = new GameEngine();

// Populate World
WorldFactory.populate(engine);

// Simulate a player entering the world
const player = CharacterCreator.create({
  accountId: 'user_123',
  name: 'Perseus',
  raceId: 'humano_altherion',
  classId: 'caballero_alba',
  distributedPoints: { fuerza: 2, constitucion: 2, presencia: 2 },
  startingRoomId: 'villaclara_plaza'
});

engine.registerPlayer(player);

console.log(`\n--- Player Session Started ---`);
console.log(`Player: ${player.name} (${player.classId})`);
console.log(`Stats:`, player.stats);

// Test interaction: LOOK
const lookResult = engine.commands.look(player.id);
console.log(`\n[LOOK] Room: ${lookResult.room.name}`);
console.log(`Description: ${lookResult.room.description}`);
console.log(`Exits: ${lookResult.room.exits.map((e: any) => e.direction).join(', ')}`);

// Test interaction: MOVE (to Panadería)
console.log(`\n[MOVE] Moving East...`);
const moveResult = engine.commands.move(player.id, 'east');
console.log(`Result: ${moveResult.message}`);

const lookPanaderia = engine.commands.look(player.id);
console.log(`\n[LOOK] Room: ${lookPanaderia.room.name}`);
console.log(`Occupants: ${lookPanaderia.occupants.map((o: any) => o.name).join(', ')}`);

// Test GET
console.log(`\n[GET] Coger Pan Bendito...`);
const getResult = engine.commands.get(player.id, 'Pan Bendito');
console.log(`Result: ${getResult.message}`);

// Test INVENTORY
console.log(`\n[INVENTORY] Comprobando inventario...`);
const inv = engine.commands.getInventory(player.id);
console.log(`Inventario: ${inv.map(i => i.name).join(', ')}`);

// Test SCORE
console.log(`\n[SCORE] Comprobando ficha...`);
const score = engine.commands.getScore(player.id);
console.log(`Ficha: ${score.name}, Nivel ${score.level} ${score.class}, HP: ${score.derived.hpCurrent}`);

// Test MOVE to Combat Zone (Plaza -> Campo -> Colinas)
console.log(`\n[MOVE] Caminando a las Colinas...`);
engine.commands.move(player.id, 'west');
engine.commands.move(player.id, 'north');
const moveColinas = engine.commands.move(player.id, 'north');
console.log(`Result: ${moveColinas.message}`);

// Test COMBAT
console.log(`\n[COMBAT] Atacando al Conejo...`);
const killResult = engine.commands.kill(player.id, 'Conejo');
console.log(killResult.combatLog?.join('\n'));

// Test Memory
console.log(`\n[MEMORY] Checking flag 'otilia_nombre_recuperado': ${engine.checkMemoryFlag(player.id, 'otilia_nombre_recuperado')}`);
engine.setMemoryFlag(player.id, 'otilia_nombre_recuperado');
console.log(`[MEMORY] Setting flag...`);
console.log(`[MEMORY] Checking flag again: ${engine.checkMemoryFlag(player.id, 'otilia_nombre_recuperado')}`);

console.log(`\n--- Smoke Test Completed ---`);
