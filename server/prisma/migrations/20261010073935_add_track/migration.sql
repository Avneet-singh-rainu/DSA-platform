-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "track" TEXT NOT NULL DEFAULT 'DSA';

-- CreateIndex
CREATE INDEX "Topic_track_idx" ON "Topic"("track");
