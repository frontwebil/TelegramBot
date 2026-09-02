-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "chat_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_id_chat_id_key" ON "User"("user_id", "chat_id");
