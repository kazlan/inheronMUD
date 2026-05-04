import { GameEngine, WorldFactory } from 'engine';

const engine = new GameEngine();
WorldFactory.populate(engine);

const room = engine.getRoom('villaclara_plaza');
console.log('Room villaclara_plaza entities:', room?.entities);

const npc = engine.entities.getNPC('anciano_sabio');
console.log('NPC anciano_sabio:', npc?.name);

console.log('Test complete.');
