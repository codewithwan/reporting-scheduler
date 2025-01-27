-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetPasswordToken" VARCHAR,
ADD COLUMN     "resetPasswordTokenExpiry" TIMESTAMP(3);
