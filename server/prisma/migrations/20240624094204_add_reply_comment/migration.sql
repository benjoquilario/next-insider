-- CreateTable
CREATE TABLE "ReplyComment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "commentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ReplyComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikeReplyComment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "replyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "LikeReplyComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReplyComment_userId_commentId_key" ON "ReplyComment"("userId", "commentId");

-- CreateIndex
CREATE UNIQUE INDEX "LikeReplyComment_userId_replyId_key" ON "LikeReplyComment"("userId", "replyId");

-- AddForeignKey
ALTER TABLE "ReplyComment" ADD CONSTRAINT "ReplyComment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReplyComment" ADD CONSTRAINT "ReplyComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeReplyComment" ADD CONSTRAINT "LikeReplyComment_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "ReplyComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeReplyComment" ADD CONSTRAINT "LikeReplyComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
