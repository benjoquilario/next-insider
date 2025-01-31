import { create } from "zustand"
import { type ISelectedFile } from "@/types"

interface SelectUpdatePost {
  postId: string
  content: string
  selectedFile: ISelectedFile[]
}

interface InitialState {
  isPostOpen: boolean
  setIsPostOpen: (value: boolean) => void
  isUpdating: boolean
  setIsUpdating: (value: boolean) => void
  postId: string
  setUpdatePostId: (value: string) => void
  setSelectedPost: (selectPost: SelectUpdatePost) => void
  selectedPost: SelectUpdatePost
  clearSelectedPost: () => void
  deletedFiles: string[]
  setDeletedFiles: (id: string) => void
  clearDeletedFiles: () => void
  deletedKeys: string[]
  setDeletedKeys: (key: string) => void
  clearDeletedKeys: () => void
}
const usePostStore = create<InitialState>((set) => ({
  isPostOpen: false,
  setIsPostOpen: (value) => set({ isPostOpen: value }),
  isUpdating: false,
  setIsUpdating: (value) => set({ isUpdating: value }),
  postId: "",
  setUpdatePostId: (postId) => set({ postId }),
  selectedPost: {
    postId: "",
    content: "",
    selectedFile: [],
  },
  setSelectedPost: (selectedPost) => set({ selectedPost }),
  deletedFiles: [],
  setDeletedFiles: (id) =>
    set((state) => ({ deletedFiles: [id, ...state.deletedFiles] })),
  clearSelectedPost: () =>
    set({ selectedPost: { postId: "", content: "", selectedFile: [] } }),
  clearDeletedFiles: () => set({ deletedFiles: [] }),
  deletedKeys: [],
  setDeletedKeys: (key) =>
    set((state) => ({ deletedKeys: [key, ...state.deletedKeys] })),
  clearDeletedKeys: () => set({ deletedKeys: [] }),
}))

export default usePostStore
