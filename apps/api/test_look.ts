import { GameEngine, WorldFactory, Database, Player } from 'engine';

async function test() {
  const engine = new GameEngine();
  WorldFactory.populate(engine);

  // create a fake player
  const p = new Player('acc1', 'TestPlayer', {fuerza:5, destreza:5, constitucion:5, ingenio:5, sabiduria:5, presencia:5, percepcion:5}, 'warrior', 'human', 'villaclara_plaza');
  engine.registerPlayer(p);

  const lookData = engine.commands.look(p.id);
  console.log(JSON.stringify(lookData, null, 2));
}

test();
