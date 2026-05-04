import { GameEngine } from './game-engine';
import { NPC } from '../models/npc.model';
import { Spawner } from '../models/spawner.model';

export class RespawnManager {
  constructor(private engine: GameEngine) {}

  public tick(now: number) {
    // Determine active areas (areas with at least one player)
    const activeAreas = new Set<string>();
    for (const player of this.engine.entities.getPlayers()) {
      const room = this.engine.getRoom(player.roomId);
      if (room && room.areaId) {
        activeAreas.add(room.areaId);
      }
    }

    this.engine.entities.spawners.forEach((spawner) => {
      // Check if spawner's area is active (Sleep Mode)
      const room = this.engine.getRoom(spawner.roomId);
      if (room && room.areaId && !activeAreas.has(room.areaId)) {
        return; // Skip spawning, area is asleep
      }

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
      const weight = (variant as any).weight || variant.chance || 0;
      accumulated += weight;
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
    if (template.flags) npc.flags = [...template.flags];
    if (template.effects) {
      template.effects.forEach((eff: any) => {
        npc.activeEffects.push({ ...eff, startTime: Date.now(), id: eff.id || `eff_${Math.random()}` });
      });
    }

    if (template.inventory) {
      template.inventory.forEach((itemId: string) => {
        const itemTemplate = this.engine.entities.itemTemplates.get(itemId as string);
        if (itemTemplate) {
          const itemClone = new (require('../models/item.model').Item)(itemTemplate.name, itemTemplate.description, itemTemplate.type);
          if (itemTemplate.equipSlot) itemClone.equipSlot = itemTemplate.equipSlot;
          if (itemTemplate.metadata) itemClone.metadata = itemTemplate.metadata;
          if (itemTemplate.value !== undefined) itemClone.value = itemTemplate.value;
          this.engine.registerItem(itemClone);
          npc.inventory.push(itemClone.id);
        }
      });
    }

    if (template.equipment) {
      for (const [slot, itemId] of Object.entries(template.equipment)) {
        const itemTemplate = this.engine.entities.itemTemplates.get(itemId as string);
        if (itemTemplate) {
          // Import Item and ItemType here if not at top, or just use strings if possible.
          // Wait, Item and ItemType are imported at top.
          const itemClone = new (require('../models/item.model').Item)(itemTemplate.name, itemTemplate.description, itemTemplate.type);
          if (itemTemplate.equipSlot) itemClone.equipSlot = itemTemplate.equipSlot;
          if (itemTemplate.metadata) itemClone.metadata = itemTemplate.metadata;
          if (itemTemplate.value !== undefined) itemClone.value = itemTemplate.value;
          this.engine.registerItem(itemClone);
          npc.equipment[slot] = itemClone.id;
        }
      }
    }

    // Register into the world
    this.engine.registerNPC(npc);
    const room = this.engine.getRoom(spawner.roomId);
    if (room) {
      room.addEntity(npc.id);
      npc.areaId = room.areaId;
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
