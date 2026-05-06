import { GameEngine } from '../src/core/game-engine';
import { WorldFactory } from '../src/core/world-factory';
import { Player } from '../src/models/player.model';

async function testAdmin() {
  console.log('--- TEST: AdminManager ---');
  const engine = new GameEngine();
  
  // 1. Populate world
  WorldFactory.populate(engine, ['villaclara']);
  
  // 2. Create Admin and Player
  const admin = new Player('AdminUser', 'ADMIN', 'HUMAN', 'admin_1');
  admin.roomId = 'villaclara_plaza';
  engine.registerPlayer(admin);
  
  const target = new Player('TargetPlayer', 'WARRIOR', 'DWARF', 'target_1');
  target.roomId = 'villaclara_plaza';
  engine.registerPlayer(target);

  console.log(`Estado Inicial: Admin en ${admin.roomId}, Target en ${target.roomId}`);

  // 3. Test GOTO
  console.log('\n[TEST] Goto: Moviendo admin a la iglesia...');
  const gotoResult = engine.admin.goto(admin.id, 'villaclara_iglesia');
  console.log('Resultado:', gotoResult.message);
  console.log('Admin ahora está en:', admin.roomId);

  // 4. Test SUMMON
  console.log('\n[TEST] Summon: Trayendo al target a la iglesia...');
  const summonResult = engine.admin.summon(admin.id, target.id);
  console.log('Resultado:', summonResult.message);
  console.log('Target ahora está en:', target.roomId);

  // 5. Test SET-FLAG / SET-VARIABLE
  console.log('\n[TEST] Flags/Variables...');
  engine.admin.setFlag(target.id, 'test_flag');
  engine.admin.setFlag(target.id, 'test_var', 'valor_secreto');
  
  const debugData = engine.admin.debugPlayer(target.id);
  console.log('Flags detectados:', debugData.flags);
  console.log('Variables detectadas:', debugData.variables);

  // 6. Test SPAWN Item
  console.log('\n[TEST] Give Item...');
  const giveResult = engine.admin.giveItem(target.id, 'item_espada_cobre');
  console.log('Resultado:', giveResult.message);
  console.log('Inventario del target:', target.inventory);

  // 7. Test SPAWN NPC
  console.log('\n[TEST] Spawn NPC...');
  const spawnResult = engine.admin.spawn(admin.id, 'anciano_sabio');
  console.log('Resultado:', spawnResult.message);
  
  const room = engine.getRoom(admin.roomId);
  console.log('Entidades en la sala (model):', room?.entities);

  // 8. Test INSPECT ROOM
  console.log('\n[TEST] Inspect Room...');
  const inspectResult = engine.admin.inspectRoom(admin.id);
  console.log('ID de Sala:', inspectResult.id);
  console.log('Jugadores activos:', inspectResult.players_active.map((p: any) => p.name));
  console.log('NPCs activos:', inspectResult.npcs_active.map((n: any) => n.name));

  console.log('\n--- TEST COMPLETADO ---');
}

testAdmin().catch(console.error);
