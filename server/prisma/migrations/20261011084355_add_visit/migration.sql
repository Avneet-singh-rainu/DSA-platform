-- CreateTable
CREATE TABLE "Visit" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Visit_day_idx" ON "Visit"("day");

-- CreateIndex
CREATE INDEX "Visit_path_idx" ON "Visit"("path");
