interface IPostValues {
  content: string
  selectedFile: File[]
}

interface InfinitePage<T> {
  data: T
  hasNextPage: boolean
  nextOffset: number
}

interface ISelectedFile {
  url: string
  postId?: string
  id?: string
  key: string
}

interface IPost<T> {
  id: string
  name: string
  content: string
  selectedFile: ISelectedFile[]
  user: T
  userId: string
  createdAt: Date
  updatedAt: Date
  isLiked: boolean
  _count: {
    likePost: number
    comment: number
  }
  isFollowing: boolean
  likePost: LikePost<T>[]
}

interface IComment<T> {
  id: string
  isEdited: boolean
  comment: string
  user: T
  userId: string
  createdAt: Date
  updatedAt: Date
  isLiked: boolean
  _count: {
    commentLike: number
    replyComment: number
  }
}

interface IReplyComment<T> {
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
}

interface LikePost<T> {
  id: string
  postId: string
  user: T
}

interface ICommentPage<T> {
  comments: T
  hasNextPage: boolean
  nextSkip: number
}

interface IReplyPage<T> {
  replies: T
  hasNextPage: boolean
  nextSkip: number
}

interface ICreatePost {
  content: string
  selectedFile: ISelectedFile[] | null
}

interface IUpdatePost extends ICreatePost {
  postId: string
}

interface ICreateComment {
  commentText: string
  postId: string
}

interface IUpdateComment extends ICreateComment {
  commentId: string
}

interface IUser {
  id: string
  cover: string
  email: string
  image: string
}

interface IActivity<T> {
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

enum IActivityType {
  POST_LIKE = "POST_LIKE",
  FOLLOW_USER = "FOLLOW_USER",
  CREATE_COMMENT = "CREATE_COMMENT",
  COMMENT_LIKE = "COMMENT_LIKE",
  CREATE_REPLY = "CREATE_REPLY",
  REPLY_LIKE = "REPLY_LIKE",
}

interface StoredFile {
  id: string
  name: string
  url: string
}
