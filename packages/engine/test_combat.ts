import { GameEngine, WorldFactory, Database } from './src';

async function testCombat() {
  const engine = new GameEngine();
  WorldFactory.populate(engine);
  
  const playerId = 'f4dfca3b-74d3-42e4-b842-fbba4d8cd81d'; // BetaTesterHero
  const player = await engine.loadPlayer(playerId);
  if (!player) {
    console.log('Player not found');
    return;
  }
  
  player.roomId = 'villaclara_campo_norte';
  engine.registerPlayer(player);
  
  console.log(`Player ${player.name} coins: ${player.coins}`);
  
  const res = engine.commands.kill(playerId, 'conejo');
  console.log('Combat Initiate:', res.message);
  
  if (res.success) {
    // Force process ticks
    for (let i = 0; i < 20; i++) {
       console.log(`--- Tick ${i} ---`);
       engine.processTick();
    }
  }
  
  const updatedPlayer = engine.getPlayer(playerId);
  console.log(`Player ${updatedPlayer.name} final coins: ${updatedPlayer.coins}`);
}

testCombat().catch(console.error);
