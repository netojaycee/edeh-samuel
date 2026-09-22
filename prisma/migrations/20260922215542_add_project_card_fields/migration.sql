-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "cardDescription" TEXT,
ADD COLUMN     "cardTitle" TEXT,
ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'marketing',
ADD COLUMN     "companyLogoUrl" TEXT,
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "stats" JSONB;
