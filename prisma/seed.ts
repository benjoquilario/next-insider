import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import Activity from '../Activity.json';
import Comments from '../Comment.json';
import CommentLike from '../CommentLike.json';
import Follow from '../Follow.json';
import LikeReplyComment from '../LikeReplyComment.json';
import ReplyComment from '../ReplyComment.json';

type Activitytype =
  | 'POST_LIKE'
  | 'FOLLOW_USER'
  | 'CREATE_COMMENT'
  | 'COMMENT_LIKE'
  | 'CREATE_REPLY'
  | 'REPLY_LIKE';

async function main() {
  // for (const replyComment of ReplyComment) {
  //   await prisma.replyComment.create({
  //     data: {
  //       id: replyComment.id,
  //       createdAt: new Date(replyComment.createdAt).toISOString(),
  //       commentId: replyComment.commentId,
  //       userId: replyComment.userId,
  //       content: replyComment.content,
  //       isEdited: null,
  //     },
  //   });
  // }
  // for (const likeReply of LikeReplyComment) {
  //   await prisma.likeReplyComment.create({
  //     data: {
  //       id: likeReply.id,
  //       createdAt: new Date(likeReply.createdAt).toISOString(),
  //       replyId: likeReply.replyId,
  //       userId: likeReply.userId,
  //     },
  //   });
  // }
  // for (const activity of Activity) {
  //   await prisma.activity.create({
  //     data: {
  //       id: activity.id,
  //       createdAt: new Date(activity.createdAt).toISOString(),
  //       targetId: activity.targetId,
  //       type: activity.type as Activitytype,
  //       sourceUserId: activity.sourceUserId,
  //       content: activity.content,
  //       contentId: activity.contentId,
  //     },
  //   });
  // }
  // for (const commentLike of CommentLike) {
  //   await prisma.commentLike.create({
  //     data: {
  //       id: commentLike.id,
  //       createdAt: new Date(commentLike.createdAt).toISOString(),
  //       commentId: commentLike.commentId,
  //       userId: commentLike.userId,
  //     },
  //   });
  // }
  // for (const comments of Comments) {
  //   await prisma.comment.create({
  //     data: {
  //       id: comments.id,
  //       comment: comments.comment,
  //       createdAt: new Date(comments.createdAt).toISOString(),
  //       updatedAt: new Date(comments.updatedAt).toISOString(),
  //       isEdited: comments.isEdited,
  //       postId: comments.postId,
  //       userId: comments.userId,
  //     },
  //   });
  // }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
