import { PrismaClient, Player } from '@prisma/client';
import * as path from 'path';

export class Database {
  private static instance: PrismaClient;

  static getInstance(): PrismaClient {
    if (!Database.instance) {
      // Find the dev.db inside packages/engine
      const dbPath = path.resolve(__dirname, '../../dev.db');
      Database.instance = new PrismaClient({
        datasources: {
          db: {
            url: process.env.DATABASE_URL || `file:${dbPath}`
          }
        }
      });
    }
    return Database.instance;
  }

  static async savePlayer(playerData: any): Promise<Player> {
    const prisma = Database.getInstance();
    
    // 1. Save Player Record
    const player = await prisma.player.upsert({
      where: { id: playerData.id },
      update: {
        name: playerData.name,
        raceId: playerData.raceId,
        classId: playerData.classId,
        roomId: playerData.roomId,
        hpCurrent: playerData.hpCurrent,
        energyCurrent: playerData.energyCurrent || 0,
        level: playerData.level || 1,
        experience: playerData.experience || 0,
        coins: playerData.coins || 0,
        stats: JSON.stringify(playerData.stats),
        metadata: JSON.stringify(playerData.metadata || {}),
        inventory: JSON.stringify(playerData.inventory),
        equipment: JSON.stringify(playerData.equipment || {}),
        visitedRooms: JSON.stringify(playerData.visitedRooms || []),
        role: playerData.role || 'USER',
      },
      create: {
        id: playerData.id,
        name: playerData.name,
        raceId: playerData.raceId,
        classId: playerData.classId,
        roomId: playerData.roomId,
        hpCurrent: playerData.hpCurrent,
        energyCurrent: playerData.energyCurrent || 0,
        level: playerData.level || 1,
        experience: playerData.experience || 0,
        coins: playerData.coins || 0,
        stats: JSON.stringify(playerData.stats),
        metadata: JSON.stringify(playerData.metadata || {}),
        inventory: JSON.stringify(playerData.inventory),
        equipment: JSON.stringify(playerData.equipment || {}),
        visitedRooms: JSON.stringify(playerData.visitedRooms || []),
        role: playerData.role || 'USER',
        account: {
          connectOrCreate: {
            where: { id: playerData.accountId },
            create: { username: playerData.accountId, id: playerData.accountId }
          }
        }
      }
    });

    // 2. Save all item instances (inventory + equipment)
    // We expect playerData.itemEntities to be a list of all Item objects currently held by the player
    if (playerData.itemEntities && Array.isArray(playerData.itemEntities)) {
       await prisma.item.deleteMany({ where: { playerId: player.id } });
       
       for (const item of playerData.itemEntities) {
         await prisma.item.create({
           data: {
             id: item.id,
             templateId: item.templateId || item.id.split('_')[0],
             name: item.name,
             description: item.description,
             type: item.type,
             value: item.value || 0,
             equipSlot: item.equipSlot,
             metadata: JSON.stringify(item.metadata || {}),
             playerId: player.id
           }
         });
       }
    }

    return player;
  }

  static async loadPlayer(id: string): Promise<any | null> {
    const prisma = Database.getInstance();
    const dbPlayer = await prisma.player.findUnique({
      where: { id },
      include: { itemInstances: true }
    });

    if (!dbPlayer) return null;

    return {
      id: dbPlayer.id,
      accountId: dbPlayer.accountId,
      name: dbPlayer.name,
      raceId: dbPlayer.raceId,
      classId: dbPlayer.classId,
      roomId: dbPlayer.roomId,
      hpCurrent: dbPlayer.hpCurrent,
      energyCurrent: dbPlayer.energyCurrent,
      level: dbPlayer.level,
      experience: dbPlayer.experience,
      coins: dbPlayer.coins,
      stats: JSON.parse(dbPlayer.stats),
      metadata: JSON.parse(dbPlayer.metadata),
      inventory: JSON.parse(dbPlayer.inventory),
      equipment: JSON.parse(dbPlayer.equipment || "{}"),
      visitedRooms: JSON.parse(dbPlayer.visitedRooms || "[]"),
      role: dbPlayer.role,
      itemInstances: dbPlayer.itemInstances.map(i => ({
        ...i,
        metadata: JSON.parse(i.metadata)
      }))
    };
  }

  static async saveMemoryFlag(playerId: string, key: string, value: string): Promise<void> {
    const prisma = Database.getInstance();
    await prisma.memoryFlag.upsert({
      where: {
        playerId_key: {
          playerId,
          key
        }
      },
      update: { value },
      create: { playerId, key, value }
    });
  }

  static async loadMemoryFlags(playerId: string): Promise<Record<string, string>> {
    const prisma = Database.getInstance();
    const flags = await prisma.memoryFlag.findMany({
      where: { playerId }
    });

    const result: Record<string, string> = {};
    flags.forEach((f: any) => {
      result[f.key] = f.value;
    });
    return result;
  }
}
