import WebSocket from 'ws';
const ws = new WebSocket('ws://localhost:4001/ws');

ws.on('open', () => {
    ws.send(JSON.stringify({ command: 'TestWho', args: [] })); // Login as TestWho
});

ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    console.log('RECEIVED:', JSON.stringify(msg, null, 2));
    
    if (msg.message && msg.message.includes('Introduce tu usuario')) {
        ws.send(JSON.stringify({ command: 'TestWho', args: [] }));
    } else if (msg.message && msg.message.includes('contrase')) {
        ws.send(JSON.stringify({ command: 'pass', args: [] }));
    } else if (msg.message && msg.message.includes('Personajes disponibles')) {
        ws.send(JSON.stringify({ command: '1', args: [] }));
    } else if (msg.type === 'INIT') {
        ws.send(JSON.stringify({ command: 'who', args: [] }));
    } else if (msg.command === 'who') {
        console.log('WHO SUCCESS');
        process.exit(0);
    }
});

setTimeout(() => {
    console.log('Timeout');
    process.exit(1);
}, 10000);
