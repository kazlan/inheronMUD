const WebSocket = require('ws');
const readline = require('readline');

const ws = new WebSocket('ws://localhost:4001/ws');

const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  gray: "\x1b[90m",
  orange: "\x1b[38;5;208m"
};

function colorize(text) {
  return text
    .replace(/<yellow>/g, colors.yellow)
    .replace(/<\/yellow>/g, colors.reset)
    .replace(/<green>/g, colors.green)
    .replace(/<\/green>/g, colors.reset)
    .replace(/<cyan>/g, colors.cyan)
    .replace(/<\/cyan>/g, colors.reset)
    .replace(/<red>/g, colors.red)
    .replace(/<\/red>/g, colors.reset)
    .replace(/<magenta>/g, colors.magenta)
    .replace(/<\/magenta>/g, colors.reset)
    .replace(/<blue>/g, colors.blue)
    .replace(/<\/blue>/g, colors.reset)
    .replace(/<gray>/g, colors.gray)
    .replace(/<\/gray>/g, colors.reset)
    .replace(/<orange>/g, colors.orange)
    .replace(/<\/orange>/g, colors.reset)
    .replace(/<b>/g, colors.bold)
    .replace(/<\/b>/g, colors.reset);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'INHERON> '
});

ws.on('open', () => {
  console.log('--- Conectado a InheronMUD Live ---');
});

ws.on('message', (data) => {
  const response = JSON.parse(data);
  
  if (response.type === 'INIT') {
    console.log(`\n${colorize('<b>' + (response.message || 'Entrando al mundo...') + '</b>')}`);
    displayRoom(response.data);
  } else if (response.type === 'SYSTEM') {
    console.log(`\n${colorize('<cyan>[SISTEMA] ' + response.message + '</cyan>')}`);
  } else if (response.type === 'CHAT') {
    const { data } = response;
    const prefix = data.type === 'tell' ? `[Susurro de ${data.sourceName}] ` : `[${data.type.toUpperCase()}] ${data.sourceName}: `;
    console.log(`\n${colorize('<blue>' + prefix + data.message + '</blue>')}`);
  } else if (response.type === 'SPATIAL') {
    console.log(`\n${colorize('<yellow>' + response.message + '</yellow>')}`);
  } else if (response.type === 'COMBAT_UPDATE') {
    if (response.combatLog) {
      console.log('\n' + response.combatLog.map(l => colorize('<red>' + l + '</red>')).join('\n'));
    }
  } else if (response.type === 'RESPONSE') {
    if (response.success) {
      if (response.command !== 'kill' && response.message) console.log(`\n${colorize('<gray>' + response.message + '</gray>')}`);
      
      // If the response contains room data, display it automatically
      if (response.data && (response.data.room || (response.command === 'look' || response.command === 'l' || isMovementCommand(response.command)))) {
        displayRoom(response.data);
      } else if (response.command === 'inventory' || response.command === 'i') {
        displayInventory(response.data);
      } else if (response.command === 'score') {
        displayScore(response.data);
      } else if (response.command === 'kill' && response.combatLog) {
        console.log('\n' + response.combatLog.map(l => colorize('<red>' + l + '</red>')).join('\n'));
      } else if (response.command === 'cronica') {
        console.log('\n--- Tu Crónica Viva ---');
        console.log(JSON.stringify(response.data, null, 2));
      }
    } else {
      console.log(`\n${colorize('<red>Error: ' + response.message + '</red>')}`);
    }
  }

  rl.prompt();
});

function isMovementCommand(cmd) {
  const directions = ['n', 's', 'e', 'o', 'w', 'norte', 'sur', 'este', 'oeste', 'move'];
  return directions.includes(cmd.toLowerCase());
}

function displayRoom(data) {
  const room = data.room || data;
  const occupants = data.occupants || [];

  console.log(`\n${colorize('<yellow><b>[' + room.name + ']</b></yellow>')}`);
  console.log(room.description);
  
  if (occupants.length > 0) {
    const formattedOccupants = occupants.map(o => {
      let color = '<white>';
      if (o.type) { // It's an item
        const rarity = o.metadata?.rarity || 'comun';
        color = rarity === 'bueno' ? '<green>' :
                rarity === 'artesanal' ? '<cyan>' :
                rarity === 'raro' ? '<blue>' :
                rarity === 'reliquia_dormida' ? '<yellow>' :
                rarity === 'reliquia_despierta' ? '<magenta>' :
                rarity === 'legendario' ? '<orange>' : 
                rarity === 'imposible' ? '<red>' : '<white>';
      } else { // It's an NPC or MOB
        if (o.isMob) {
          if (o.behaviorId === 'hostile_boss') color = '<magenta>'; // Bosses
          else if (o.levelDiff <= -2) color = '<gray>';
          else if (o.levelDiff <= 0) color = '<green>';
          else if (o.levelDiff <= 2) color = '<yellow>';
          else color = '<red>';
        } else {
          color = '<cyan>'; // Friendly NPC
        }
      }
      
      const indicator = o.questIndicator ? `<yellow><b>[${o.questIndicator}]</b></yellow> ` : '';
      return `${indicator}${color}${o.name}${color.replace('<', '</')}`;
    }).join(', ');
    console.log(`\nPersonas/Cosas aquí: ${colorize(formattedOccupants)}`);
  }
  
  const exits = room.exits || [];
  const dirMap = { 
    'north': 'norte', 'south': 'sur', 'east': 'este', 'west': 'oeste', 
    'up': 'arriba', 'down': 'abajo',
    'northeast': 'noreste', 'northwest': 'noroeste', 
    'southeast': 'sureste', 'southwest': 'suroeste'
  };
  const exitList = exits.length ? exits.map(e => colorize(`<yellow>${dirMap[e.direction] || e.direction}</yellow>`)).join(' ') : colorize('<red>ninguna</red>');
  console.log(`\n[${colorize('<yellow><b>Salidas</b></yellow>')}: ${exitList}]`);
}

function displayInventory(items) {
  console.log(`\n${colorize('<b>Tu Inventario:</b>')}`);
  if (items.length === 0) {
    console.log('  Está vacío.');
  } else {
    items.forEach(item => {
      const rarity = item.metadata?.rarity || 'comun';
      let color = rarity === 'bueno' ? '<green>' :
                  rarity === 'artesanal' ? '<cyan>' :
                  rarity === 'raro' ? '<blue>' :
                  rarity === 'reliquia_dormida' ? '<yellow>' :
                  rarity === 'reliquia_despierta' ? '<magenta>' :
                  rarity === 'legendario' ? '<orange>' : 
                  rarity === 'imposible' ? '<red>' : '<white>';
      console.log(`  - ${colorize(color + item.name + color.replace('<', '</'))} (${item.description})`);
    });
  }
}

function displayScore(score) {
  console.log(`\n${colorize('<b>FICHA DE PERSONAJE</b>')}`);
  console.log(colorize(`Nombre:  <cyan>${score.name}</cyan>  Nivel: <yellow>${score.level}</yellow>  Rango: <white>${score.gremioRank}</white>`));
  console.log(colorize(`Raza:    <green>${score.race}</green>  Clase: <green>${score.class}</green>`));
  console.log(colorize('--------------------------------------------------'));
  console.log(colorize(`Vida:    <red>${score.derived.hpCurrent}/${score.derived.hpMax}</red>  Energía: <blue>${score.derived.energyCurrent}/${score.derived.energyMax}</blue>`));
  console.log(colorize('--------------------------------------------------'));
  
  const stats = score.stats;
  console.log(colorize(`FUE: <white>${stats.fuerza}</white>  DES: <white>${stats.destreza}</white>  CON: <white>${stats.constitucion}</white>`));
  console.log(colorize(`ING: <white>${stats.ingenio}</white>  SAB: <white>${stats.sabiduria}</white>  PRE: <white>${stats.presencia}</white>`));
  console.log(colorize(`PER: <white>${stats.percepcion}</white>`));
  console.log(colorize('--------------------------------------------------'));
  if (score.equipment && Object.keys(score.equipment).length > 0) {
    console.log(colorize('<b>EQUIPO ACTUAL</b>'));
    for (const [slot, item] of Object.entries(score.equipment)) {
      const rarity = item.metadata?.rarity || 'comun';
      let color = rarity === 'bueno' ? '<green>' :
                  rarity === 'artesanal' ? '<cyan>' :
                  rarity === 'raro' ? '<blue>' :
                  rarity === 'reliquia_dormida' ? '<yellow>' :
                  rarity === 'reliquia_despierta' ? '<magenta>' :
                  rarity === 'legendario' ? '<orange>' : 
                  rarity === 'imposible' ? '<red>' : '<white>';
      console.log(colorize(`[${slot.padEnd(10)}] ${color}${item.name}${color.replace('<', '</')}`));
    }
    console.log(colorize('--------------------------------------------------'));
  }
}

rl.on('line', (line) => {
  const parts = line.trim().split(' ');
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  if (command === 'quit' || command === 'exit') {
    ws.close();
    process.exit(0);
  }

  if (command) {
    ws.send(JSON.stringify({ command, args }));
  } else {
    rl.prompt();
  }
});

ws.on('close', () => {
  console.log('\nConexión cerrada.');
  process.exit(0);
});

ws.on('error', (err) => {
  console.error('\nError de conexión:', err.message);
  process.exit(1);
});
