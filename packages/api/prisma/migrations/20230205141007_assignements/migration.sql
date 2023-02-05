/*
  Warnings:

  - Made the column `priority` on table `RoleOnUser` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RoleOnUser" (
    "roleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
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
