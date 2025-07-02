// useAuthStore.ts
import { axiosInstance } from "@/utils/axios.util";
import { create } from "zustand";

// type User = {
//   id: string;
//   name: string;
//   email: string;
// };

// type AuthState = {
//   isAuthenticated: boolean;
//   user: User | null;
//   fetchUser: () => Promise<void>;
//   logout: () => void;
//   userFetchError?: string;
//   userFetchLoading?: boolean;
//   logoutLoading?: boolean;
// };

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,

  fetchUser: async () => {
    try {
      set({ userFetchLoading: true, userFetchError: null });
      const res = await axiosInstance.get("/auth/me");
      if (res.status !== 200 || !res.data) {
        console.warn("User fetch response was not successful:", res);
        set({
          user: null,
          isAuthenticated: false,
          userFetchError: "Failed to fetch user",
          userFetchLoading: false,
        });
        return;
      }

      set({
        user: res.data,
        isAuthenticated: true,
        userFetchError: null,
        userFetchLoading: false,
      });
    } catch (err) {
      console.error("Auth check failed:", err);
      set({
        user: null,
        isAuthenticated: false,
        userFetchError: "Failed to fetch user",
        userFetchLoading: false,
      });
    }
  },

  logout: async () => {
    try {
      set({ logoutLoading: true });
      await axiosInstance.delete("/auth/logout");
      console.log("Logout successful");
    } catch (err) {
      console.warn("Logout failed:", err);
    } finally {
      set({ user: null, isAuthenticated: false, logoutLoading: false });
    }
  },
}));
