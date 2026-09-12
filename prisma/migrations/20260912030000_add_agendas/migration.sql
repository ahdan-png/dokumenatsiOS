CREATE TABLE "Agenda" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Agenda_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Agenda_sectionId_slug_key" ON "Agenda"("sectionId", "slug");
CREATE INDEX "Agenda_sectionId_idx" ON "Agenda"("sectionId");
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;
