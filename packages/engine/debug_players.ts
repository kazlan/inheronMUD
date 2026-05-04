import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const players = await prisma.player.findMany({
    select: { name: true, roomId: true, experience: true, coins: true, level: true }
  });
  console.log(JSON.stringify(players, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
