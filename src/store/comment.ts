import { create } from "zustand"

interface SelectUpdateComment {
  commentId: string
  comment: string
}

interface CommentStore {
  selectedComment: SelectUpdateComment
  isAlertOpen: boolean
  setIsAlertOpen: (value: boolean) => void
  setSelectedComment: (selectComment: SelectUpdateComment) => void
  clearSelectedComment: () => void
}

const useCommentStore = create<CommentStore>((set) => ({
  selectedComment: {
    commentId: "",
    comment: "",
  },
  isAlertOpen: false,
  setIsAlertOpen: (value) => set({ isAlertOpen: value }),
  setSelectedComment: (selectedComment) => set({ selectedComment }),
  clearSelectedComment: () =>
    set({ selectedComment: { comment: "", commentId: "" } }),
}))

export default useCommentStore
