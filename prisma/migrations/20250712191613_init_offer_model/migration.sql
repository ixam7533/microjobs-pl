/*
  Warnings:

  - You are about to drop the column `address` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `areas` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `cost` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `negotiable` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Offer` table. All the data in the column will be lost.
  - Added the required column `category` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactEmail` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactName` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Offer` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Offer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ownerId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "autrenew" BOOLEAN NOT NULL DEFAULT true,
    "location" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Offer_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Offer" ("createdAt", "description", "id", "ownerId", "title", "updatedAt") SELECT "createdAt", "description", "id", "ownerId", "title", "updatedAt" FROM "Offer";
DROP TABLE "Offer";
ALTER TABLE "new_Offer" RENAME TO "Offer";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
