-- AlterTable
ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT;

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "creatorId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tagline" TEXT,
    "description" TEXT,
    "coverImage" TEXT,
    "gallery" TEXT,
    "type" TEXT NOT NULL DEFAULT 'ONE_TIME',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "priceCents" INTEGER NOT NULL,
    "compareAtCents" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "pricingModel" TEXT NOT NULL DEFAULT 'ONE_TIME',
    "bestSeller" BOOLEAN NOT NULL DEFAULT false,
    "instantDelivery" BOOLEAN NOT NULL DEFAULT true,
    "lifetimeUpdates" BOOLEAN NOT NULL DEFAULT true,
    "included" TEXT,
    "highlights" TEXT,
    "faq" TEXT,
    "comparison" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "ogImageUrl" TEXT,
    "customSlug" TEXT,
    "refundPolicy" TEXT NOT NULL DEFAULT '30_DAY',
    "blockOrder" TEXT,
    "bonuses" TEXT,
    "discountCodes" TEXT,
    "categoryId" TEXT,
    "salesCount" INTEGER NOT NULL DEFAULT 0,
    "ratingAvg" REAL NOT NULL DEFAULT 0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("bestSeller", "categoryId", "compareAtCents", "comparison", "coverImage", "createdAt", "creatorId", "currency", "description", "faq", "gallery", "highlights", "id", "included", "instantDelivery", "lifetimeUpdates", "priceCents", "publishedAt", "ratingAvg", "ratingCount", "salesCount", "slug", "status", "tagline", "title", "type", "updatedAt", "viewsCount") SELECT "bestSeller", "categoryId", "compareAtCents", "comparison", "coverImage", "createdAt", "creatorId", "currency", "description", "faq", "gallery", "highlights", "id", "included", "instantDelivery", "lifetimeUpdates", "priceCents", "publishedAt", "ratingAvg", "ratingCount", "salesCount", "slug", "status", "tagline", "title", "type", "updatedAt", "viewsCount" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
CREATE INDEX "Product_creatorId_status_idx" ON "Product"("creatorId", "status");
CREATE INDEX "Product_categoryId_status_idx" ON "Product"("categoryId", "status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
