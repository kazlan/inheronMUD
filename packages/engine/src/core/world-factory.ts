import { GameEngine } from './game-engine';
import { Room } from '../models/room.model';
import { NPC } from '../models/npc.model';
import { Item, ItemType } from '../models/item.model';
import { Spawner } from '../models/spawner.model';
import { DataLoader } from '../data/loader';
import * as fs from 'fs';
import * as path from 'path';

export class WorldFactory {
  static populate(engine: GameEngine, areaNames?: string[]): void {
    const loader = new DataLoader();
    
    // Load System Data (Skills, Classes, Races)
    const systemData = loader.loadSystem();
    if (systemData.skills) {
      engine.skills.loadFromData(systemData.skills);
      console.log(`[WorldFactory] Loaded ${systemData.skills.length} skills from system data.`);
    }
    if (systemData.classes) {
      engine.classesData = systemData.classes;
      console.log(`[WorldFactory] Loaded ${systemData.classes.length} classes from system data.`);
    }
    if (systemData.races) {
      engine.racesData = systemData.races;
      console.log(`[WorldFactory] Loaded ${systemData.races.length} races from system data.`);
    }
    
    const areasToLoad = areaNames || loader.getAllAreaNames();

    let totalRooms = 0;
    let totalNpcs = 0;
    let totalItems = 0;

    for (const areaName of areasToLoad) {
      const areaData = loader.loadArea(areaName);

      // 1. Create and register rooms
      areaData.rooms.forEach(data => {
        const room = new Room(data.name, data.description, data.id);
        if (data.exits) {
          data.exits.forEach((exit: any) => room.addExit(exit));
        }
        engine.registerRoom(room);
        totalRooms++;
      });

      // 2. Create and register items
      areaData.items.forEach(data => {
        const item = new Item(data.name, data.description, data.type as ItemType, data.id);
        if (data.equipSlot) item.equipSlot = data.equipSlot;
        if (data.metadata) item.metadata = data.metadata;
        engine.registerItem(item);
        totalItems++;

        // Place item in room if specified
        if (data.roomId) {
          const room = engine.getRoom(data.roomId);
          if (room) {
            room.addEntity(item.id);
          }
        }
      });

      // 3. Create and register NPCs
      areaData.npcs.forEach(data => {
        const npc = new NPC(
          data.name,
          data.description,
          data.stats,
          data.behaviorId,
          data.roomId,
          data.id
        );
        if (data.level) npc.level = data.level;
        if (data.metadata) npc.metadata = data.metadata;
        
        // Register the template data to allow spawning clones later
        engine.entities.registerNPCTemplate(data.id, data);

        engine.registerNPC(npc);
        totalNpcs++;
        
        // Place NPC in room
        const room = engine.getRoom(data.roomId);
        if (room) {
          room.addEntity(npc.id);
        }
      });

      // 4. Create and register Spawners
      if (areaData.spawners) {
        areaData.spawners.forEach(data => {
          const spawner = new Spawner(
            data.id,
            data.roomId,
            data.maxActive || 1,
            data.intervalMs || 30000,
            data.variants || []
          );
          engine.entities.registerSpawner(spawner);
        });
      }
    }

    console.log(`World populated from YAML: ${totalRooms} rooms, ${totalNpcs} NPCs, ${totalItems} items, and spawners.`);
  }

  static reloadArea(engine: GameEngine, areaName: string): void {
    const loader = new DataLoader();
    const areaData = loader.loadArea(areaName);
    
    let updatedRooms = 0, updatedNpcs = 0, updatedItems = 0;

    // Update or Create Rooms (preserve entities like players inside)
    areaData.rooms.forEach(data => {
      let room = engine.getRoom(data.id);
      if (room) {
        room.name = data.name;
        room.description = data.description;
        room.exits = data.exits || [];
        updatedRooms++;
      } else {
        const newRoom = new Room(data.name, data.description, data.id);
        if (data.exits) data.exits.forEach((exit: any) => newRoom.addExit(exit));
        engine.registerRoom(newRoom);
        updatedRooms++;
      }
    });

    // Update or Create Items
    areaData.items.forEach(data => {
      let item = engine.entities.getItem(data.id);
      if (item) {
        item.name = data.name;
        item.description = data.description;
        item.type = data.type as ItemType;
        if (data.equipSlot) item.equipSlot = data.equipSlot;
        if (data.metadata) item.metadata = data.metadata;
        if (data.value !== undefined) item.value = data.value;
        updatedItems++;
      } else {
        const newItem = new Item(data.name, data.description, data.type as ItemType, data.id);
        if (data.equipSlot) newItem.equipSlot = data.equipSlot;
        if (data.metadata) newItem.metadata = data.metadata;
        if (data.value !== undefined) newItem.value = data.value;
        engine.registerItem(newItem);
        if (data.roomId) {
          const r = engine.getRoom(data.roomId);
          if (r) r.addEntity(newItem.id);
        }
        updatedItems++;
      }
    });

    // Update or Create NPCs
    areaData.npcs.forEach(data => {
      let npc = engine.entities.getNPC(data.id);
      if (npc) {
        npc.name = data.name;
        npc.description = data.description;
        npc.stats = data.stats;
        npc.behaviorId = data.behaviorId;
        if (data.level) npc.level = data.level;
        if (data.metadata) npc.metadata = data.metadata;
        // Not touching npc.roomId to avoid moving them if they walked away
        updatedNpcs++;
      } else {
        const newNpc = new NPC(data.name, data.description, data.stats, data.behaviorId, data.roomId, data.id);
        if (data.level) newNpc.level = data.level;
        if (data.metadata) newNpc.metadata = data.metadata;
        engine.registerNPC(newNpc);
        if (data.roomId) {
          const r = engine.getRoom(data.roomId);
          if (r) r.addEntity(newNpc.id);
        }
        updatedNpcs++;
      }
    });

    console.log(`[Hot-Reload] Area '${areaName}' updated en caliente: ${updatedRooms} salas, ${updatedNpcs} NPCs, ${updatedItems} items.`);
  }

  static watchAllData(engine: GameEngine): void {
    const loader = new DataLoader();
    const areasDir = path.join(loader.getAreaPath(''), '..'); // get the 'areas' dir

    if (!fs.existsSync(areasDir)) return;

    // 1. Watch each existing area folder
    const areas = loader.getAllAreaNames();
    const watchedAreas = new Set<string>();

    const watchAreaFolder = (areaName: string) => {
      if (watchedAreas.has(areaName)) return;
      const areaPath = loader.getAreaPath(areaName);
      if (fs.existsSync(areaPath)) {
        console.log(`[Hot-Reload] Vigilando cambios en el área: ${areaName}...`);
        fs.watch(areaPath, (eventType, filename) => {
          if (filename && filename.endsWith('.yml')) {
            setTimeout(() => {
              this.reloadArea(engine, areaName);
            }, 100);
          }
        });
        watchedAreas.add(areaName);
      }
    };

    areas.forEach(watchAreaFolder);

    // 2. Watch the root 'areas' folder for NEW areas being created
    console.log(`[Hot-Reload] Vigilando creación de nuevas áreas en /data/areas/...`);
    fs.watch(areasDir, (eventType, filename) => {
      if (filename && eventType === 'rename') {
        const areaPath = path.join(areasDir, filename);
        if (fs.existsSync(areaPath) && fs.statSync(areaPath).isDirectory()) {
          // A new folder was created (or renamed to this)
          if (!watchedAreas.has(filename)) {
            console.log(`[Hot-Reload] Nueva área detectada: ${filename}. Cargando...`);
            setTimeout(() => {
              this.reloadArea(engine, filename);
              watchAreaFolder(filename);
            }, 500); // Give it half a second to ensure files inside are written
          }
        }
      }
    });
  }
}
