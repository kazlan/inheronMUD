import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Migrando todos los jugadores a villaclara_plaza...');
  const result = await prisma.player.updateMany({
    data: {
      roomId: 'villaclara_plaza'
    }
  });
  console.log(`Migración completada. ${result.count} jugadores movidos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
