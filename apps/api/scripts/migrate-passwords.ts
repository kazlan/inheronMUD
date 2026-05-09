import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as path from 'path';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || `file:${path.resolve(__dirname, '../../../packages/engine/dev.db')}`
    }
  }
});

async function migrate() {
  console.log('Starting password migration to bcrypt...');
  const accounts = await prisma.account.findMany();
  
  let migrated = 0;
  for (const account of accounts) {
    if (!account.password) continue;
    
    // Check if it's already a bcrypt hash (starts with $2b$ or $2a$ etc. usually 60 chars)
    if (account.password.startsWith('$2') && account.password.length === 60) {
      continue;
    }
    
    const newHash = await bcrypt.hash(account.password, 10);
    await prisma.account.update({
      where: { id: account.id },
      data: { password: newHash }
    });
    migrated++;
    console.log(`Migrated password for user: ${account.username}`);
  }
  
  console.log(`Migration complete. ${migrated} accounts updated.`);
  await prisma.$disconnect();
}

migrate().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
