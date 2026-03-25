import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './products';

interface BuildState {
  selectedParts: Product[];
  addPart: (part: Product) => void;
  removePart: (partId: string) => void;
  clearBuild: () => void;
  setBuild: (parts: Product[]) => void;
}

export const useBuildStore = create<BuildState>()(
  persist(
    (set) => ({
      selectedParts: [],
      addPart: (part) => set((state) => ({
        selectedParts: [...state.selectedParts.filter(p => p.category !== part.category), part]
      })),
      removePart: (partId) => set((state) => ({
        selectedParts: state.selectedParts.filter((p) => p.id !== partId)
      })),
      clearBuild: () => set({ selectedParts: [] }),
      setBuild: (parts) => set({ selectedParts: parts }),
    }),
    {
      name: 'ai-workstation-build',
    }
  )
);
