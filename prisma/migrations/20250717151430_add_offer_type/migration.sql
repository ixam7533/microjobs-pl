-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Offer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "autorenew" BOOLEAN NOT NULL DEFAULT true,
    "location" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "price" REAL DEFAULT 0,
    "offerType" TEXT NOT NULL DEFAULT 'szukam_pracownika',
    "promoted" BOOLEAN NOT NULL DEFAULT false,
    "promotedUntil" DATETIME,
    "ownerId" INTEGER NOT NULL,
    CONSTRAINT "Offer_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Offer" ("autorenew", "category", "contactEmail", "contactName", "contactPhone", "createdAt", "description", "id", "location", "ownerId", "price", "promoted", "promotedUntil", "title", "updatedAt") SELECT "autorenew", "category", "contactEmail", "contactName", "contactPhone", "createdAt", "description", "id", "location", "ownerId", "price", "promoted", "promotedUntil", "title", "updatedAt" FROM "Offer";
DROP TABLE "Offer";
ALTER TABLE "new_Offer" RENAME TO "Offer";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
