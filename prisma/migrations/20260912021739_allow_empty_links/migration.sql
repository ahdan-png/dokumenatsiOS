-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Section" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT,
    "description" TEXT NOT NULL,
    "wallpaperUrl" TEXT,
    "passwordHash" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Section" ("createdAt", "description", "id", "link", "name", "passwordHash", "slug", "updatedAt", "wallpaperUrl") SELECT "createdAt", "description", "id", "link", "name", "passwordHash", "slug", "updatedAt", "wallpaperUrl" FROM "Section";
DROP TABLE "Section";
ALTER TABLE "new_Section" RENAME TO "Section";
CREATE UNIQUE INDEX "Section_slug_key" ON "Section"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
