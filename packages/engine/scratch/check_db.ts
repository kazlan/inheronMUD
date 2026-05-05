import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const players = await prisma.player.findMany();
  console.log(JSON.stringify(players, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
