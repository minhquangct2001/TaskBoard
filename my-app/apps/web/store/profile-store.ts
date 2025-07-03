import { create } from 'zustand'

interface ProfileState {
  user: {
    name: string
    email: string
    avatarUrl?: string
  } | null
  setUser: (user: ProfileState['user']) => void
}

export const useProfileStore = create<ProfileState>((set) => ({
  user: {
    name: 'John Doe',
    email: 'john@example.com',
    avatarUrl: 'https://github.com/shadcn.png' // default avatar
  },
  setUser: (user) => set({ user })
}))
