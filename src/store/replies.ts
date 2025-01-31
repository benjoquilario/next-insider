import { create } from "zustand"

interface SelectUpdateReplies {
  repliesId: string
  content: string
}

interface RepliesStore {
  selectedReplies: SelectUpdateReplies
  isAlertOpen: boolean
  setIsAlertOpen: (value: boolean) => void
  setSelectedReplies: (selectedReplies: SelectUpdateReplies) => void
  clearSelectedReplies: () => void
}

const useRepliesStore = create<RepliesStore>((set) => ({
  selectedReplies: {
    repliesId: "",
    content: "",
  },
  isAlertOpen: false,
  setIsAlertOpen: (value) => set({ isAlertOpen: value }),
  setSelectedReplies: (selectedReplies) => set({ selectedReplies }),
  clearSelectedReplies: () =>
    set({ selectedReplies: { content: "", repliesId: "" } }),
}))

export default useRepliesStore
