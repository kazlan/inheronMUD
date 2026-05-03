import { GameEngine } from './game-engine';
import { NPC } from '../models/npc.model';
import { Spawner } from '../models/spawner.model';

export class RespawnManager {
  constructor(private engine: GameEngine) {}

  public tick(now: number) {
    this.engine.entities.spawners.forEach((spawner) => {
      // Cleanup dead instances
      spawner.activeInstances = spawner.activeInstances.filter(id => !!this.engine.entities.getNPC(id));

      if (spawner.activeInstances.length < spawner.maxActive) {
        if (now - spawner.lastSpawnTime >= spawner.intervalMs) {
          this.spawnFrom(spawner, now);
        }
      }
    });
  }

  private spawnFrom(spawner: Spawner, now: number) {
    const roll = Math.random() * 100;
    let accumulated = 0;
    let selectedVariant = spawner.variants[0];

    for (const variant of spawner.variants) {
      accumulated += variant.chance;
      if (roll <= accumulated) {
        selectedVariant = variant;
        break;
      }
    }

    if (!selectedVariant) return;

    // Check unique constraint globally
    if (selectedVariant.unique) {
      const isAlive = Array.from(this.engine.entities.npcs.values()).some(n => n.id.startsWith(selectedVariant.npcId + '_'));
      if (isAlive) {
        return; // Skip spawning if unique and already alive
      }
    }

    // Clone NPC from template
    const template = this.engine.entities.npcTemplates.get(selectedVariant.npcId);
    if (!template) {
      console.warn(`[RespawnManager] Template no encontrado para ${selectedVariant.npcId}`);
      return;
    }

    const newId = `${selectedVariant.npcId}_${Date.now()}`;
    const npc = new NPC(
      template.name,
      template.description,
      { ...template.stats },
      template.behaviorId,
      spawner.roomId,
      newId
    );

    if (template.level) npc.level = template.level;
    if (template.metadata) npc.metadata = { ...template.metadata };

    // Register into the world
    this.engine.registerNPC(npc);
    const room = this.engine.getRoom(spawner.roomId);
    if (room) {
      room.addEntity(npc.id);
    }

    // Broadcast spawn message to players in room
    const msg = `\n<yellow>De repente aparece: ${npc.name}.</yellow>`;
    room?.entities.forEach(entityId => {
      if (this.engine.entities.getPlayer(entityId)) {
        this.engine.emit('combat_message', entityId, [msg]);
      }
    });

    spawner.activeInstances.push(npc.id);
    spawner.lastSpawnTime = now;
  }
}
