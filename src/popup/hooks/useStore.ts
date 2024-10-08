import { create } from "zustand";

interface Store {
  colors: { url: string; color: string }[];
  setColors: (colors: Store["colors"]) => void;
}

export const useStore = create<Store>((set) => ({
  colors: [],
  setColors: (colors) => set({ colors }),
}));
