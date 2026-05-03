-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Player" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "raceId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL DEFAULT 'villaclara_plaza',
    "hpCurrent" INTEGER NOT NULL,
    "stats" TEXT NOT NULL,
    "inventory" TEXT NOT NULL DEFAULT '[]',
    "equipment" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Player_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Player" ("accountId", "classId", "createdAt", "hpCurrent", "id", "inventory", "name", "raceId", "roomId", "stats", "updatedAt") SELECT "accountId", "classId", "createdAt", "hpCurrent", "id", "inventory", "name", "raceId", "roomId", "stats", "updatedAt" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
CREATE UNIQUE INDEX "Player_name_key" ON "Player"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
