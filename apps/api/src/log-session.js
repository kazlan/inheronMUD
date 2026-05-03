const WebSocket = require('ws');
const fs = require('fs');

const logFile = 'session_log.txt';
fs.writeFileSync(logFile, '--- Sesión Iniciada ---\n');

const ws = new WebSocket('ws://localhost:3000/ws');

function log(msg) {
  console.log(msg);
  fs.appendFileSync(logFile, msg + '\n');
}

ws.on('open', () => {
  log('--- Conectado ---');
  
  setTimeout(() => {
    log('> look');
    ws.send(JSON.stringify({ command: 'look', args: [] }));
  }, 1000);

  setTimeout(() => {
    log('> move este');
    ws.send(JSON.stringify({ command: 'move', args: ['este'] }));
  }, 3000);

  setTimeout(() => {
    ws.close();
    log('--- Sesión Finalizada ---');
    process.exit(0);
  }, 5000);
});

ws.on('message', (data) => {
  const response = JSON.parse(data);
  log(`Recibido: ${response.type}`);
  if (response.data) {
    const room = response.data.room || response.data;
    log(`Localización: ${room.name}`);
    if (response.data.occupants) log(`Ocupantes: ${response.data.occupants.map(o => o.name).join(', ')}`);
  }
});

ws.on('error', (err) => log('Error: ' + err.message));
