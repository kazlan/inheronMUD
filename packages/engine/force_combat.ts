import WebSocket from 'ws';

async function forceCombat() {
  const ws = new WebSocket('ws://localhost:4001/ws');
  
  ws.on('open', () => {
    console.log('Connected');
    ws.send(JSON.stringify({
      type: 'login',
      accountId: 'BetaTester',
      password: 'password123'
    }));
  });

  ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    console.log('Message:', msg.type);
    
    if (msg.type === 'login_success') {
       console.log('Login success');
       // Move to field
       ws.send(JSON.stringify({ type: 'command', command: 'north' }));
    }
    
    if (msg.type === 'command_result' && msg.command === 'north') {
       console.log('Moved North');
       ws.send(JSON.stringify({ type: 'command', command: 'k conejo' }));
    }
    
    if (msg.type === 'COMBAT_UPDATE') {
       console.log('Combat:', msg.combatLog.join('\n'));
    }
  });

  ws.on('error', console.error);
}

forceCombat().catch(console.error);
