-- CreateTable
CREATE TABLE "credentialpasswords" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    CONSTRAINT "credentialpasswords_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "credentialpasswords_user_id_key" ON "credentialpasswords"("user_id");
