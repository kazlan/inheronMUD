import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';
import { z } from 'zod';

// --- SCHEMAS (Copied for stability in script) ---
const StatsSchema = z.object({
  fuerza: z.number().int().min(0),
  destreza: z.number().int().min(0),
  constitucion: z.number().int().min(0),
  ingenio: z.number().int().min(0),
  sabiduria: z.number().int().min(0),
  percepcion: z.number().int().min(0),
});

const ExitSchema = z.object({
  direction: z.string(),
  targetRoomId: z.string(),
  description: z.string().optional(),
  hidden: z.boolean().optional(),
  locked: z.boolean().optional(),
  keyId: z.string().optional(),
});

const RoomSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  area: z.string().optional(),
  exits: z.array(ExitSchema).optional(),
  scenery: z.record(z.string(), z.union([z.string(), z.any()])).optional(),
  effects: z.array(z.any()).optional(),
});

const NPCSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  roomId: z.string(),
  behaviorId: z.string(),
  level: z.number().int().min(1).optional(),
  stats: StatsSchema,
  flags: z.array(z.string()).optional(),
  inventory: z.array(z.string()).optional(),
  equipment: z.record(z.string(), z.string()).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  enemies: z.array(z.string()).optional(),
});

const ItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  type: z.enum(['EQUIPMENT', 'CONSUMABLE', 'TRASH', 'QUEST', 'KEY', 'MISC']),
  value: z.number().int().min(0).optional(),
  equipSlot: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  roomId: z.string().optional(),
});

const SpawnerSchema = z.object({
  id: z.string(),
  roomId: z.string(),
  maxActive: z.number().int().min(1).optional(),
  intervalMs: z.number().int().min(1000).optional(),
  variants: z.array(z.object({
    npcId: z.string(),
    weight: z.number().min(0).optional(),
  })).optional(),
});
// --- END SCHEMAS ---

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '../packages/engine/data');
const AREAS_DIR = path.join(DATA_DIR, 'areas');

let hasErrors = false;

function validateFile(filePath, schema, type) {
  if (!fs.existsSync(filePath)) return;
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(content);
    
    if (!Array.isArray(data)) {
      console.error(`[ERROR] ${filePath} must be an array.`);
      hasErrors = true;
      return;
    }

    data.forEach((item, index) => {
      const result = schema.safeParse(item);
      if (!result.success) {
        console.error(`[ERROR] ${type} "${item.id || index}" in ${filePath}:`);
        console.error(JSON.stringify(result.error.format(), null, 2));
        hasErrors = true;
      }
    });
  } catch (e) {
    console.error(`[ERROR] Failed to parse YAML in ${filePath}:`, e.message);
    hasErrors = true;
  }
}

function runValidation() {
  console.log('--- Iniciando Validación de Datos del Mundo ---');
  
  if (!fs.existsSync(AREAS_DIR)) {
    console.error(`[ERROR] Directorio de áreas no encontrado en ${AREAS_DIR}`);
    process.exit(1);
  }

  const areas = fs.readdirSync(AREAS_DIR).filter(f => fs.statSync(path.join(AREAS_DIR, f)).isDirectory());

  for (const area of areas) {
    const areaPath = path.join(AREAS_DIR, area);
    console.log(`\nValidando área: ${area}...`);
    
    validateFile(path.join(areaPath, 'rooms.yml'), RoomSchema, 'Room');
    validateFile(path.join(areaPath, 'npcs.yml'), NPCSchema, 'NPC');
    validateFile(path.join(areaPath, 'items.yml'), ItemSchema, 'Item');
    validateFile(path.join(areaPath, 'spawners.yml'), SpawnerSchema, 'Spawner');
  }

  if (hasErrors) {
    console.error('\n--- VALIDACIÓN FALLIDA ---');
    process.exit(1);
  } else {
    console.log('\n--- VALIDACIÓN COMPLETADA CON ÉXITO ---');
    process.exit(0);
  }
}

runValidation();
