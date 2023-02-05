/*
  Warnings:

  - A unique constraint covering the columns `[key,roleId]` on the table `RolePermission` will be added. If there are existing duplicate values, this will fail.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RoleOnUser" (
    "roleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "priority" INTEGER,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT,

    PRIMARY KEY ("roleId", "userId"),
    CONSTRAINT "RoleOnUser_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RoleOnUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_RoleOnUser" ("assignedAt", "assignedBy", "priority", "roleId", "userId") SELECT "assignedAt", "assignedBy", "priority", "roleId", "userId" FROM "RoleOnUser";
DROP TABLE "RoleOnUser";
ALTER TABLE "new_RoleOnUser" RENAME TO "RoleOnUser";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_key_roleId_key" ON "RolePermission"("key", "roleId");
