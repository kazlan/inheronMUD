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
    
    return prisma.player.upsert({
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
        role: playerData.role || 'USER',
        account: {
          connectOrCreate: {
            where: { username: playerData.accountId },
            create: { username: playerData.accountId, id: playerData.accountId }
          }
        }
      }
    });
  }

  static async loadPlayer(id: string): Promise<any | null> {
    const prisma = Database.getInstance();
    const dbPlayer = await prisma.player.findUnique({
      where: { id }
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
      role: dbPlayer.role
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
