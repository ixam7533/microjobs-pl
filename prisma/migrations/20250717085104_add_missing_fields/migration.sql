-- AlterTable
ALTER TABLE "Message" ADD COLUMN "receiverId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "confirmToken" TEXT;
