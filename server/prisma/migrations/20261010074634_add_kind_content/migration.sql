-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "content" TEXT,
ADD COLUMN     "kind" TEXT NOT NULL DEFAULT 'problem';
