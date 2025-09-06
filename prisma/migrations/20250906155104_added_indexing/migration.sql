/*
  Warnings:

  - A unique constraint covering the columns `[userId,postId]` on the table `LikePost` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "public"."Account"("userId");

-- CreateIndex
CREATE INDEX "Activity_targetId_idx" ON "public"."Activity"("targetId");

-- CreateIndex
CREATE INDEX "Activity_sourceUserId_idx" ON "public"."Activity"("sourceUserId");

-- CreateIndex
CREATE INDEX "Activity_targetId_createdAt_idx" ON "public"."Activity"("targetId", "createdAt");

-- CreateIndex
CREATE INDEX "Activity_type_targetId_idx" ON "public"."Activity"("type", "targetId");

-- CreateIndex
CREATE INDEX "Activity_contentId_idx" ON "public"."Activity"("contentId");

-- CreateIndex
CREATE INDEX "Comment_postId_idx" ON "public"."Comment"("postId");

-- CreateIndex
CREATE INDEX "Comment_userId_idx" ON "public"."Comment"("userId");

-- CreateIndex
CREATE INDEX "Comment_postId_createdAt_idx" ON "public"."Comment"("postId", "createdAt");

-- CreateIndex
CREATE INDEX "Comment_createdAt_idx" ON "public"."Comment"("createdAt");

-- CreateIndex
CREATE INDEX "LikePost_postId_idx" ON "public"."LikePost"("postId");

-- CreateIndex
CREATE INDEX "LikePost_userId_idx" ON "public"."LikePost"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LikePost_userId_postId_key" ON "public"."LikePost"("userId", "postId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "public"."Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "public"."Notification"("userId", "isRead");

-- CreateIndex
CREATE INDEX "Notification_userId_createdAt_idx" ON "public"."Notification"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_type_userId_idx" ON "public"."Notification"("type", "userId");

-- CreateIndex
CREATE INDEX "Notification_fromUserId_idx" ON "public"."Notification"("fromUserId");

-- CreateIndex
CREATE INDEX "Post_userId_idx" ON "public"."Post"("userId");

-- CreateIndex
CREATE INDEX "Post_createdAt_idx" ON "public"."Post"("createdAt");

-- CreateIndex
CREATE INDEX "Post_userId_createdAt_idx" ON "public"."Post"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Post_updatedAt_idx" ON "public"."Post"("updatedAt");

-- CreateIndex
CREATE INDEX "ReplyComment_commentId_idx" ON "public"."ReplyComment"("commentId");

-- CreateIndex
CREATE INDEX "ReplyComment_userId_idx" ON "public"."ReplyComment"("userId");

-- CreateIndex
CREATE INDEX "ReplyComment_commentId_createdAt_idx" ON "public"."ReplyComment"("commentId", "createdAt");

-- CreateIndex
CREATE INDEX "SelectedFile_postId_idx" ON "public"."SelectedFile"("postId");

-- CreateIndex
CREATE INDEX "SelectedFile_key_idx" ON "public"."SelectedFile"("key");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "public"."Session"("userId");

-- CreateIndex
CREATE INDEX "Session_expires_idx" ON "public"."Session"("expires");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "public"."User"("createdAt");

-- CreateIndex
CREATE INDEX "User_username_email_idx" ON "public"."User"("username", "email");
