/*
  Warnings:

  - You are about to drop the column `sportId` on the `Club` table. All the data in the column will be lost.
  - Added the required column `sportId` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Club" DROP CONSTRAINT "Club_sportId_fkey";

-- AlterTable
ALTER TABLE "Club" DROP COLUMN "sportId";

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "nickName" TEXT,
ADD COLUMN     "photoUrl" TEXT;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "sportId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "Sport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
