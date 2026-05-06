import { z } from 'zod';

export const StatsSchema = z.object({
  fuerza: z.number().int().min(0),
  destreza: z.number().int().min(0),
  constitucion: z.number().int().min(0),
  ingenio: z.number().int().min(0),
  sabiduria: z.number().int().min(0),
  presencia: z.number().int().min(0),
  percepcion: z.number().int().min(0),
});

export const ExitSchema = z.object({
  direction: z.string(),
  targetRoomId: z.string(),
  description: z.string().optional(),
  hidden: z.boolean().optional(),
  locked: z.boolean().optional(),
  keyId: z.string().optional(),
});

export const RoomSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  area: z.string().optional(),
  exits: z.array(ExitSchema).optional(),
  scenery: z.record(z.string(), z.union([z.string(), z.any()])).optional(),
  effects: z.array(z.any()).optional(),
});

export const NPCSchema = z.object({
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

export const ItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  type: z.enum(['EQUIPMENT', 'CONSUMABLE', 'TRASH', 'QUEST', 'KEY', 'MISC']),
  value: z.number().int().min(0).optional(),
  equipSlot: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  roomId: z.string().optional(),
});

export const SpawnerSchema = z.object({
  id: z.string(),
  roomId: z.string(),
  maxActive: z.number().int().min(1).optional(),
  intervalMs: z.number().int().min(1000).optional(),
  variants: z.array(z.object({
    npcId: z.string(),
    weight: z.number().min(0).optional(),
  })).optional(),
});
