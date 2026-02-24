-- CreateTable
CREATE TABLE "FamilyProject" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "hideLivingForNonAdmin" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);
CREATE UNIQUE INDEX "FamilyProject_slug_key" ON "FamilyProject"("slug");

CREATE TABLE "User" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE "Membership" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "role" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "familyProjectId" TEXT NOT NULL,
  CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Membership_familyProjectId_fkey" FOREIGN KEY ("familyProjectId") REFERENCES "FamilyProject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Membership_userId_familyProjectId_key" ON "Membership"("userId", "familyProjectId");

CREATE TABLE "Person" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "externalId" TEXT,
  "familyProjectId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "gender" TEXT,
  "birthDate" DATETIME,
  "deathDate" DATETIME,
  "isAlive" BOOLEAN NOT NULL DEFAULT true,
  "birthPlace" TEXT,
  "deathPlace" TEXT,
  "notes" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Person_familyProjectId_fkey" FOREIGN KEY ("familyProjectId") REFERENCES "FamilyProject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Person_familyProjectId_name_idx" ON "Person"("familyProjectId", "name");

CREATE TABLE "Relationship" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "familyProjectId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "fromPersonId" TEXT NOT NULL,
  "toPersonId" TEXT NOT NULL,
  "metadata" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Relationship_familyProjectId_fkey" FOREIGN KEY ("familyProjectId") REFERENCES "FamilyProject" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Relationship_fromPersonId_fkey" FOREIGN KEY ("fromPersonId") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Relationship_toPersonId_fkey" FOREIGN KEY ("toPersonId") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Relationship_familyProjectId_type_idx" ON "Relationship"("familyProjectId", "type");

CREATE TABLE "Source" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "personId" TEXT NOT NULL,
  "citationText" TEXT NOT NULL,
  "url" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Source_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Media" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "personId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "filename" TEXT NOT NULL,
  "title" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Media_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
