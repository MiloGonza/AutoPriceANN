import { create } from 'zustand'

export const useModelStore = create((set) => ({
  status: 'idle',
  model: null,
  error: null,

  setStatus: (status) => set({ status }),
  setModel: (model) => set({ model }),
  setError: (error) => set({ error }),
}))
