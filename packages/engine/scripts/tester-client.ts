import WebSocket from 'ws';
import * as fs from 'fs';
import * as path from 'path';

const REPORT_PATH = path.resolve(__dirname, '../../../docs/reporte-testers.md');
const API_URL = 'ws://localhost:4001/ws';

class TesterPlayer {
    private ws: WebSocket | null = null;
    private name: string;
    private isPlaying = false;
    private currentRoom: any = null;
    private currentCombat: any = null;
    private static reportedObservations: Set<string> = new Set();

    constructor(name: string) {
        this.name = name;
    }

    async connect() {
        console.log(`[Tester:${this.name}] Conectando a ${API_URL}...`);
        this.ws = new WebSocket(API_URL);

        this.ws.on('open', () => {
            console.log(`[Tester:${this.name}] Conexión abierta.`);
        });

        this.ws.on('message', (data: string) => {
            try {
                const msg = JSON.parse(data.toString());
                this.handleServerMessage(msg);
            } catch (e) {
                console.error('Error parseando mensaje:', e);
            }
        });

        this.ws.on('error', (err) => {
            console.error(`[Tester:${this.name}] Error WS:`, err.message);
        });

        this.ws.on('close', () => {
            console.log(`[Tester:${this.name}] Conexión cerrada.`);
            this.isPlaying = false;
        });
    }

    private send(command: string) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ command, args: [] }));
        }
    }

    private handleServerMessage(msg: any) {
        if (msg.message || msg.type === 'SYSTEM') {
            const text = (msg.message || '').toLowerCase();
            if (text.includes('introduce tu usuario')) this.send(this.name);
            else if (text.includes('contraseña')) this.send('password123');
            else if (text.includes('nuevo personaje')) this.send(this.name + 'Hero');
            else if (text.includes('selecciona') || text.includes('disponibles')) this.send('1');
            else if (text.includes('raza')) this.send('humano_arvell');
            else if (text.includes('clase')) this.send('caballero_alba');
            else if (text.includes('bienvenido')) {
                if (!this.isPlaying) {
                    this.isPlaying = true;
                    this.report('INFO', 'Entrada exitosa al mundo.');
                    this.gameLoop();
                }
            }
        }

        if (msg.type === 'INIT' && msg.data?.room) {
            this.analyzeRoom(msg.data);
        }

        if (msg.type === 'room' && msg.data) {
            this.analyzeRoom({ room: msg.data, occupants: msg.data.entities });
        }

        if (msg.type === 'command_result' && msg.command === 'look' && msg.data) {
            this.analyzeRoom(msg.data);
        }

        if (msg.type === 'SPATIAL') {
            this.analyzeSpatial(msg.message);
        }

        if (msg.type === 'combat_message') {
            this.analyzeCombat(msg.message);
        }

        if (msg.type === 'command_result' && (msg.command === 'kill' || msg.command === 'k') && msg.success) {
            this.currentCombat = { startTime: Date.now() };
        }
    }

    private report(type: string, observation: string) {
        // Aggressive de-duplicate: ignore if this exact observation was already reported
        if (TesterPlayer.reportedObservations.has(observation)) return;
        TesterPlayer.reportedObservations.add(observation);

        const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
        const entry = `- [ ] [${type}] [${timestamp}] **${this.name}**: ${observation}\n`;
        
        try {
            let currentContent = fs.existsSync(REPORT_PATH) ? fs.readFileSync(REPORT_PATH, 'utf8') : '';
            fs.writeFileSync(REPORT_PATH, entry + currentContent);
        } catch (e) {
            console.error('Error writing report:', e);
        }
    }

    private analyzeRoom(data: any) {
        const room = data.room;
        const occupants = data.occupants || [];
        this.currentRoom = { ...room, entities: occupants };
        
        this.report('Exploración', `Entrando en "${room.name}" (${room.id})`);

        if (room.description.length < 150) {
            this.report('Narrativa', `Descripción pobre en "${room.name}". Solo ${room.description.length} caracteres.`);
        }

        const exits = room.exits || [];
        exits.forEach((e: any) => {
            const dirSp = this.translateDirection(e.direction);
            if (!room.description.toLowerCase().includes(e.direction.toLowerCase()) && 
                !room.description.toLowerCase().includes(dirSp)) {
                this.report('Mapa', `La salida "${e.direction}" no se menciona claramente en la descripción de "${room.name}".`);
            }
        });

        const npcs = occupants.filter((o: any) => o.type === 'NPC' && !o.isMob);
        if (npcs.length > 0) {
            this.report('IA', `Avistado NPC social: ${npcs.map((n: any) => n.name).join(', ')} en "${room.name}".`);
        }
    }

    private translateDirection(dir: string): string {
        const d: Record<string, string> = {
            north: 'norte', south: 'sur', east: 'este', west: 'oeste',
            up: 'arriba', down: 'abajo', northeast: 'noreste', northwest: 'noroeste'
        };
        return d[dir.toLowerCase()] || dir;
    }

    private analyzeSpatial(message: string) {
        const cleanMsg = message.replace(/<[^>]*>/g, '');
        if (message.includes('aura')) {
            this.report('Ambiente', `Efecto perceptible: ${cleanMsg}`);
        }
        if (message.includes('conjura') || message.includes('lanza') || message.includes('restaurando')) {
            this.report('IA', `Comportamiento activo de NPC: ${cleanMsg}`);
        }
        if (message.includes('saluda') || message.includes('bienvenido') || message.includes('murmura')) {
            this.report('IA', `Interacción social de NPC: ${cleanMsg}`);
        }
    }

    private analyzeCombat(message: string | string[]) {
        const fullMsg = Array.isArray(message) ? message.join('\n') : message;
        const cleanMsg = fullMsg.replace(/<[^>]*>/g, '');
        
        if (fullMsg.includes('HAS SUBIDO DE NIVEL')) {
            const levelMatch = fullMsg.match(/nivel (\d+)/);
            const level = levelMatch ? levelMatch[1] : '?';
            this.report('Progreso', `¡LEVEL UP! El personaje ha alcanzado el nivel ${level}.`);
        }
        
        if (fullMsg.includes('monedas de cobre')) {
            const coinsMatch = fullMsg.match(/recibido (\d+) monedas/);
            const coins = coinsMatch ? coinsMatch[1] : '?';
            this.report('Progreso', `¡LOOT! Ganadas ${coins} monedas.`);
        }

        if (fullMsg.includes('soltado:')) {
            this.report('Progreso', `¡LOOT! Los enemigos soltaron items.`);
        }

        if (fullMsg.includes('muere') || fullMsg.includes('vencido')) {
            this.report('Combate', `Victoria detectada: ${cleanMsg.substring(0, 100)}...`);
            if (this.currentCombat) {
                const duration = (Date.now() - this.currentCombat.startTime) / 1000;
                this.report('Dificultad', `Combate finalizado en ${duration}s. Loot y XP recibidos.`);
                this.currentCombat = null;
            }
        }
    }

    private async gameLoop() {
        while (this.isPlaying) {
            const delay = 8000 + Math.random() * 7000;
            await new Promise(resolve => setTimeout(resolve, delay));
            if (!this.isPlaying) break;

            let cmd = 'look';
            const roll = Math.random();
            const mobs = this.currentRoom?.entities?.filter((e: any) => e.isMob) || [];

            if (mobs.length > 0 && roll < 0.8) {
                const target = mobs[0].name.split(' ')[0].toLowerCase();
                cmd = `k ${target}`;
            } else if (roll < 0.6 || mobs.length === 0) {
                // If no mobs, 100% chance to move or look.
                // If mobs, 60% chance to move anyway to explore more.
                if (this.currentRoom?.exits?.length > 0) {
                    const exit = this.currentRoom.exits[Math.floor(Math.random() * this.currentRoom.exits.length)];
                    cmd = exit.direction;
                } else {
                    cmd = 'look';
                }
            } else if (roll < 0.8) {
                cmd = 'score';
            } else {
                cmd = 'look';
            }
            this.send(cmd);
        }
    }

    public stop() {
        this.isPlaying = false;
        if (this.ws) this.ws.close();
    }
}

const tester1 = new TesterPlayer('AlphaTester');
const tester2 = new TesterPlayer('BetaTester');

async function main() {
    await tester1.connect();
    await new Promise(r => setTimeout(r, 5000));
    await tester2.connect();
}

main();

const duration = 60 * 60 * 1000;
setTimeout(() => {
    tester1.stop();
    tester2.stop();
    const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
    const finalReport = `- [ ] [SISTEMA] [${timestamp}] Sesión de prueba cualitativa finalizada.\n`;
    let current = fs.existsSync(REPORT_PATH) ? fs.readFileSync(REPORT_PATH, 'utf8') : '';
    fs.writeFileSync(REPORT_PATH, finalReport + current);
    process.exit(0);
}, duration);
