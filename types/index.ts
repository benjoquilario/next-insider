export interface IPost<T> {
  id: string
  name: string
  content: string
  selectedFile: ISelectedFile[]
  user: T
  userId: string
  createdAt: Date
  updatedAt: Date
  isLiked: boolean
  isUserPost: boolean
  _count: {
    likePost: number
    comment: number
  }
  isFollowing: boolean
  // likePost: LikePost<T>[]
}

export interface ISelectedFile {
  url: string
  postId?: string
  id?: string
  key: string
}

export interface IPage<T> {
  data: T
  hasNextPage: boolean
  nextSkip: number
}

export interface CreatePost {
  content: string
  selectedFile: ISelectedFile[] | null
}

import { User } from "@/generated/prisma"
import { type ClientUploadedFileData } from "uploadthing/types"

export interface Comment<T> {
  id: string
  isEdited: boolean
  comment: string
  user: T
  userId: string
  createdAt: Date
  updatedAt: Date
  isLiked: boolean
  isUserComment: boolean
  _count: {
    commentLike: number
    replyComment: number
  }
  haveReplies: boolean
}

export interface CreateComment {
  commentText: string
  postId: string
}

export interface ReplyComment<T> {
  id: string
  isEdited: boolean
  content: string
  user: T
  userId: string
  createdAt: Date
  updatedAt: Date
  isLiked: boolean
  _count: {
    likeReplyComment: number
  }
  isUserReplies: boolean
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UploadedFile<T = unknown> extends ClientUploadedFileData<T> {}
export interface PostData {
  content: string
  selectedFile: File[]
}

export interface PhotoUpload {
  file: File[]
}

export interface IActivity<T> {
  content: string
  contentId: string
  createdAt: string
  id: string
  sourceUser: T
  sourceUserId: string
  targetId: string
  targetUser: T
  type: IActivityType
}

export enum IActivityType {
  POST_LIKE = "POST_LIKE",
  FOLLOW_USER = "FOLLOW_USER",
  CREATE_COMMENT = "CREATE_COMMENT",
  COMMENT_LIKE = "COMMENT_LIKE",
  CREATE_REPLY = "CREATE_REPLY",
  REPLY_LIKE = "REPLY_LIKE",
}

export interface UpdatePost extends CreatePost {
  postId: string
}

export interface UserProfile extends User {
  isFollowing: boolean
  followerCount: number
  followingCount: number
  isProfileOwner: boolean
}
