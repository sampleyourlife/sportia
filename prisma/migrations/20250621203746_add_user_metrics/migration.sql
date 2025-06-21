-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateEnum
CREATE TYPE "FitnessGoal" AS ENUM ('WEIGHT_LOSS', 'MUSCLE_GAIN', 'STRENGTH', 'ENDURANCE', 'FLEXIBILITY', 'GENERAL_FITNESS', 'SPORT_SPECIFIC', 'REHABILITATION');

-- CreateEnum
CREATE TYPE "ActivityLevel" AS ENUM ('SEDENTARY', 'LIGHTLY_ACTIVE', 'MODERATELY_ACTIVE', 'VERY_ACTIVE', 'EXTREMELY_ACTIVE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activityLevel" "ActivityLevel",
ADD COLUMN     "age" INTEGER,
ADD COLUMN     "experienceLevel" "ExperienceLevel",
ADD COLUMN     "fitnessGoals" "FitnessGoal"[],
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "medicalConditions" TEXT,
ADD COLUMN     "preferences" JSONB,
ADD COLUMN     "weight" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bodyFatPercentage" DOUBLE PRECISION,
    "muscleMass" DOUBLE PRECISION,
    "workoutHistory" JSONB,
    "progressPhotos" TEXT[],
    "measurements" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMetrics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weight" DOUBLE PRECISION,
    "bodyFat" DOUBLE PRECISION,
    "muscleMass" DOUBLE PRECISION,
    "chest" DOUBLE PRECISION,
    "waist" DOUBLE PRECISION,
    "hips" DOUBLE PRECISION,
    "biceps" DOUBLE PRECISION,
    "thighs" DOUBLE PRECISION,
    "neck" DOUBLE PRECISION,
    "benchPress" DOUBLE PRECISION,
    "squat" DOUBLE PRECISION,
    "deadlift" DOUBLE PRECISION,
    "pullUps" INTEGER,
    "pushUps" INTEGER,
    "cardioTime" INTEGER,
    "distance" DOUBLE PRECISION,
    "vo2Max" DOUBLE PRECISION,
    "restingHR" INTEGER,
    "maxHR" INTEGER,
    "flexibility" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE INDEX "UserMetrics_userId_date_idx" ON "UserMetrics"("userId", "date");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMetrics" ADD CONSTRAINT "UserMetrics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
