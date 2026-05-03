const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3000/ws');

ws.on('open', () => {
  console.log('--- Sesión de Prueba en Vivo ---');
  // 1. Look
  setTimeout(() => {
    console.log('> look');
    ws.send(JSON.stringify({ command: 'look', args: [] }));
  }, 500);

  // 2. Move
  setTimeout(() => {
    console.log('\n> move este');
    ws.send(JSON.stringify({ command: 'move', args: ['este'] }));
  }, 1500);

  // 3. Cronica
  setTimeout(() => {
    console.log('\n> cronica');
    ws.send(JSON.stringify({ command: 'cronica', args: [] }));
  }, 2500);

  // 4. Close
  setTimeout(() => {
    ws.close();
  }, 3500);
});

ws.on('message', (data) => {
  const response = JSON.parse(data);
  if (response.type === 'INIT') {
    console.log(`\nINIT: ${response.message}`);
    displayRoom(response.data);
  } else if (response.type === 'RESPONSE') {
    if (response.message) console.log(response.message);
    if (response.data) {
       if (response.command === 'cronica') {
         console.log('Memory Flags:', response.data.memoryFlags);
       } else {
         displayRoom(response.data);
       }
    }
  }
});

function displayRoom(data) {
  const room = data.room || data;
  const occupants = data.occupants || [];
  console.log(`[${room.name}] - ${room.description}`);
  if (occupants.length > 0) console.log(`Occupants: ${occupants.map(o => o.name).join(', ')}`);
  console.log(`Exits: ${room.exits.map(e => e.direction).join(', ')}`);
}

ws.on('error', (err) => console.error('Error:', err.message));
