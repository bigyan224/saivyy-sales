/*
  Warnings:

  - You are about to drop the `Invited_Emails` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."Invited_Emails";

-- CreateTable
CREATE TABLE "public"."InvitedEmail" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "is_used" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "InvitedEmail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InvitedEmail_email_key" ON "public"."InvitedEmail"("email");
