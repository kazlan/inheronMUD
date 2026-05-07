import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const players = await prisma.player.findMany({
    where: {
      name: {
        contains: 'Perseo',
      }
    }
  });
  console.log(JSON.stringify(players, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
