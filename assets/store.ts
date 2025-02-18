import { create } from "zustand";

interface ProfileStore {
  imageUrl: string | null; // Store the image URL
  setImageUrl: (url: string) => void; // Action to update the image URL
}

export const useProfileStore = create<ProfileStore>((set) => ({
  imageUrl: null, // Initial state
  setImageUrl: (url) => set({ imageUrl: url }), // Action to update state
}));

interface ProfileNameStore {
  ProfileName: string | null; 
  setName: (name: string) => void; 
}

export const useProfileNameStore = create<ProfileNameStore>((set) => ({
  ProfileName: null, 
  setName: (name) => set({ ProfileName: name }),
}));
