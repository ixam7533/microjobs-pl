/*
  Warnings:

  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChatParticipant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `category` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `subcategory` on the `Offer` table. All the data in the column will be lost.
  - Added the required column `areas` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cost` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresAt` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Offer` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Chat";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ChatParticipant";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Message";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "OfferImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "offerId" INTEGER NOT NULL,
    CONSTRAINT "OfferImage_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Offer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ownerId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "negotiable" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "areas" JSONB NOT NULL,
    "address" TEXT,
    "cost" INTEGER NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Offer_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Offer" ("createdAt", "description", "id", "ownerId", "price", "title", "updatedAt") SELECT "createdAt", "description", "id", "ownerId", "price", "title", "updatedAt" FROM "Offer";
DROP TABLE "Offer";
ALTER TABLE "new_Offer" RENAME TO "Offer";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
