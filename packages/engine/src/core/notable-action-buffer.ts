import { GameEngine } from './game-engine';

export type ActionType = 'critical_hit' | 'clutch_heal' | 'killing_blow' | 'perfect_dodge' | 'boss_mechanic_saved';

export interface ActionRecord {
  playerId: string;
  type: ActionType;
  magnitude: number;
  timestamp: number;
}

export class NotableActionBuffer {
  private buffer: ActionRecord[] = [];
  
  // The threshold of points needed to generate 1 "Aplauso"
  private readonly APLAUSO_THRESHOLD = 100;
  private currentScore: Record<string, number> = {};

  constructor(private engine: GameEngine) {}

  /**
   * Records a notable action for a player.
   */
  public recordAction(playerId: string, type: ActionType, magnitude: number): void {
    const record: ActionRecord = {
      playerId,
      type,
      magnitude,
      timestamp: Date.now()
    };
    
    this.buffer.push(record);
    this.processAction(record);
  }

  private processAction(record: ActionRecord): void {
    const player = this.engine.entities.getPlayer(record.playerId);
    if (!player) return;

    // Calculate score points for this action
    let points = 0;
    switch(record.type) {
      case 'critical_hit': points = 20 + record.magnitude; break;
      case 'clutch_heal': points = 40 + (record.magnitude * 2); break;
      case 'killing_blow': points = 50; break;
      case 'perfect_dodge': points = 30; break;
      case 'boss_mechanic_saved': points = 100; break;
    }

    if (!this.currentScore[record.playerId]) {
      this.currentScore[record.playerId] = 0;
    }
    
    this.currentScore[record.playerId] += points;

    // Check if threshold is met
    if (this.currentScore[record.playerId] >= this.APLAUSO_THRESHOLD) {
      this.currentScore[record.playerId] -= this.APLAUSO_THRESHOLD;
      
      // If the player is a Bard, they get Aplauso
      if (player.classId === 'bardo_cronica_viva' && player.bardState) {
        player.bardState.aplauso = (player.bardState.aplauso || 0) + 1;
        this.engine.emit('combat_message', player.id, [`\n<magenta>¡La hazaña inspira al grupo! Ganas 1 Aplauso.</magenta>`]);
      }
    }
  }

  /**
   * Flush the buffer, usually at the end of a combat encounter.
   */
  public flushCombat(combatId: string): void {
    // We could persist this to the DB for statistics, but for now we just clear old entries.
    const now = Date.now();
    this.buffer = this.buffer.filter(r => now - r.timestamp < 300000); // Keep last 5 minutes
  }
}
