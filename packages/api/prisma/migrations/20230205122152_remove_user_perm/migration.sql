/*
  Warnings:

  - You are about to drop the `UserPermission` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `displayName` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RoleOnUser" ADD COLUMN "priority" INTEGER;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserPermission";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Role" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "displayName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT
);
INSERT INTO "new_Role" ("createdAt", "createdBy", "id", "name") SELECT "createdAt", "createdBy", "id", "name" FROM "Role";
DROP TABLE "Role";
ALTER TABLE "new_Role" RENAME TO "Role";
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
