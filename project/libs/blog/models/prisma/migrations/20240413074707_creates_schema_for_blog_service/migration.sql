-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('Video', 'Text', 'Quote', 'Photo', 'Link');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('Published', 'Draft');

-- CreateEnum
CREATE TYPE "PostDetailType" AS ENUM ('Video', 'Photo', 'Link', 'Description', 'QuoteAuthor', 'Announcement', 'Text');

-- CreateTable
CREATE TABLE "posts" (
    "id" VARCHAR(100) NOT NULL,
    "type" "PostType" NOT NULL,
    "status" "PostStatus" NOT NULL,
    "author_id" VARCHAR(100) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "tags" VARCHAR(10)[],
    "date_create" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_update" TIMESTAMP(3) NOT NULL,
    "is_reposted" BOOLEAN NOT NULL DEFAULT false,
    "likes" VARCHAR(100)[],

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" VARCHAR(100) NOT NULL,
    "post_id" VARCHAR(100) NOT NULL,
    "author_id" VARCHAR(100) NOT NULL,
    "text" TEXT NOT NULL,
    "date_create" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts_details" (
    "id" VARCHAR(100) NOT NULL,
    "post_id" VARCHAR(100) NOT NULL,
    "type" "PostDetailType" NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "posts_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "posts_title_idx" ON "posts"("title");

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts_details" ADD CONSTRAINT "posts_details_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
