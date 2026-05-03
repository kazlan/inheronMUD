import { useState, useEffect, useCallback, useRef } from 'react';
import { AnsiUp } from 'ansi_up';

export interface LogEntry {
  id: number;
  type: string;
  text: string;
  isAnsi?: boolean;
}

export default function useMUD(url: string) {
  const [state, setState] = useState<any>({
    logs: [],
    attributes: {},
    quests: [],
    inventory: [],
    equipment: {},
    effects: [],
    targets: [],
    room: null,
    isConnected: false,
  });

  const socketRef = useRef<WebSocket | null>(null);
  const ansiUpRef = useRef<AnsiUp | null>(null);

  if (!ansiUpRef.current) {
    ansiUpRef.current = new AnsiUp();
  }

  const addLog = useCallback((type: string, text: string, isAnsi: boolean = false) => {
    setState((prev: any) => ({
      ...prev,
      logs: [...prev.logs, { id: Date.now() + Math.random(), type, text, isAnsi }].slice(-200)
    }));
  }, []);

  const handleData = useCallback((group: string, data: any) => {
    if (group === 'room') {
      const room = data.room || data;
      const occupants = data.occupants || [];
      
      // Print room header
      addLog('text', `\n[ROOM] ${room.name}`, false);
      addLog('text', room.description, false);
      
      // Print occupants with type brackets for Viewport parser
      occupants.forEach((o: any) => {
        const type = o.behaviorId === 'hostile_beast' ? 'MOB' : (o.type === 'npc' ? 'NPC' : 'Item');
        addLog('text', `[${type}] ${o.name} - ${o.description || ''}`, true);
      });
      
      // Print exits in the format Viewport parses: [Exits: north south east]
      if (room.exits && room.exits.length > 0) {
        const exitList = room.exits.map((e: any) => e.direction).join(' ');
        addLog('text', `[Exits: ${exitList}]`, true);
      }
    }

    setState((prev: any) => {
      switch (group) {
        case 'attributes': return { ...prev, attributes: data };
        case 'quests': return { ...prev, quests: data };
        case 'inventory': return { ...prev, inventory: data };
        case 'equipment': return { ...prev, equipment: data };
        case 'effects': return { ...prev, effects: data };
        case 'targets': return { ...prev, targets: data };
        case 'room': return { ...prev, room: data };
        default: return prev;
      }
    });
  }, [addLog]);

  const handleMessage = useCallback((msg: any) => {
    switch (msg.type) {
      case 'INIT':
        addLog('system', msg.message || 'Conexión establecida.', true);
        if (msg.data) handleData('room', msg.data.room || msg.data);
        break;
      case 'RESPONSE':
        if (msg.success) {
          if (msg.message) addLog('text', msg.message, true);
          
          // Map response data to state groups
          if (msg.data) {
            if (msg.command === 'inventory' || msg.command === 'i') {
              handleData('inventory', msg.data);
            } else if (msg.command === 'score') {
              handleData('attributes', msg.data);
            } else if (msg.command === 'cronica') {
              handleData('quests', msg.data);
            } else if (msg.data.room || msg.command === 'look' || ['n','s','e','o','w','u','d'].includes(msg.command)) {
              handleData('room', msg.data.room || msg.data);
            }
          }
        } else {
          addLog('system', `Error: ${msg.message}`, false);
        }
        break;
      case 'message':
        addLog('text', msg.message, true);
        break;
      case 'data':
        handleData(msg.group, msg.data);
        break;
      case 'ERROR':
        addLog('system', `Error del servidor: ${msg.message}`, false);
        break;
      default:
        console.warn('Unknown message type:', msg.type);
    }
  }, [addLog, handleData]);

  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const socket = new WebSocket(url);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log('[WS] Connected to ' + url);
        setState((prev: any) => ({ ...prev, isConnected: true }));
        // Request initial data
        setTimeout(() => {
          socket.send(JSON.stringify({ command: 'score', args: [] }));
          socket.send(JSON.stringify({ command: 'cronica', args: [] }));
          socket.send(JSON.stringify({ command: 'inventory', args: [] }));
        }, 100);
      };

      socket.onclose = () => {
        setState((prev: any) => ({ 
          ...prev, 
          isConnected: false,
          attributes: {},
          inventory: [],
          equipment: {},
          quests: [],
          effects: [],
          targets: []
        }));
        addLog('system', 'Desconectado del servidor.');
      };

      socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
        addLog('system', 'Error de conexión.');
      };

      socket.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          handleMessage(msg);
        } catch (e) {
          addLog('system', 'Error procesando mensaje del servidor');
        }
      };
    } catch (e) {
      console.error('WebSocket connection failed:', e);
    }
  }, [url, addLog, handleMessage]);

  const sendCommand = useCallback((cmd: string) => {
    console.log(`[WS] Sending: ${cmd}`);
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      const parts = cmd.trim().split(/\s+/);
      const command = parts[0];
      const args = parts.slice(1);
      socketRef.current.send(JSON.stringify({ command, args }));
    } else {
      console.warn('[WS] Cannot send, socket NOT OPEN.');
      addLog('system', 'No hay conexión con el servidor.');
    }
  }, [addLog]);

  useEffect(() => {
    connect();
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [connect]);

  return {
    ...state,
    sendCommand,
    addLog,
  };
}
