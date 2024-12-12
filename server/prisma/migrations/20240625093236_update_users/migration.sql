-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('FEMALE', 'MALE');

-- CreateEnum
CREATE TYPE "RelationshipStatus" AS ENUM ('SINGLE', 'IN_A_RELATIONSHIP', 'ENGAGED', 'MARRIED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "phoneNumber" INTEGER,
ADD COLUMN     "relationshipStatus" "RelationshipStatus",
ADD COLUMN     "website" TEXT;
