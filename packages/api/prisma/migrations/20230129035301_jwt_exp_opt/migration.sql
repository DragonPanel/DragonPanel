-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RevokedJWT" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hashedJWT" TEXT NOT NULL,
    "expiration" DATETIME
);
INSERT INTO "new_RevokedJWT" ("expiration", "hashedJWT", "id") SELECT "expiration", "hashedJWT", "id" FROM "RevokedJWT";
DROP TABLE "RevokedJWT";
ALTER TABLE "new_RevokedJWT" RENAME TO "RevokedJWT";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
