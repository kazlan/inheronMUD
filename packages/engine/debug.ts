import WebSocket from 'ws';
const ws = new WebSocket('ws://localhost:4001/ws');
ws.on('open', () => {
  ws.send(JSON.stringify({ 
    command: 'eval', 
    args: ["JSON.stringify(Array.from(engine.entities.npcs.values()).filter(n => n.name.includes('Conejo')).map(n => ({ id: n.id, room: n.roomId, areaId: n.areaId })))"] 
  }));
});
ws.on('message', data => {
  console.log(data.toString());
  process.exit(0);
});
setTimeout(() => process.exit(1), 2000);
