/*
  Warnings:

  - You are about to drop the column `actions` on the `RolePermission` table. All the data in the column will be lost.
  - Added the required column `mode` to the `RolePermission` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RolePermission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT,
    "roleId" TEXT NOT NULL,
    CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RolePermission" ("assignedAt", "assignedBy", "id", "key", "roleId") SELECT "assignedAt", "assignedBy", "id", "key", "roleId" FROM "RolePermission";
DROP TABLE "RolePermission";
ALTER TABLE "new_RolePermission" RENAME TO "RolePermission";
CREATE UNIQUE INDEX "RolePermission_key_roleId_key" ON "RolePermission"("key", "roleId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
