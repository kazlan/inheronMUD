const fs = require('fs');
const path = require('path');

// DevOpsMaster: Faro Backup Script
const engineRoot = path.resolve(__dirname, '..');
const dbPath = path.join(engineRoot, 'prisma', 'dev.db');
const backupsDir = path.join(engineRoot, 'backups');

if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir, { recursive: true });
}

if (!fs.existsSync(dbPath)) {
  console.error('[Faro] Error: No se encontró la base de datos dev.db en prisma/dev.db');
  process.exit(1);
}

const date = new Date();
const timestamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}_${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}`;

const backupName = `dev_${timestamp}.db`;
const backupPath = path.join(backupsDir, backupName);

try {
  fs.copyFileSync(dbPath, backupPath);
  console.log(`[Faro] Backup completado exitosamente: ${backupPath}`);
} catch (error) {
  console.error(`[Faro] Error crítico al realizar el backup:`, error);
  process.exit(1);
}
