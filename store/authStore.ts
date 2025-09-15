"use client";
import { create } from "zustand";
import {loggedInUser} from "@/types/user/types";

interface AuthState {
  token: string | null;
  user: loggedInUser | null;
  isLoggedIn: boolean;
  isInitialized: boolean;

  login: (token: string, user: loggedInUser) => void;
  userUpdate: (updatedUserData: Partial<loggedInUser>) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isLoggedIn: false,
  isInitialized: false,

  login: (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ token, user, isLoggedIn: true, isInitialized: true });
  },

  userUpdate: (updatedUserData) => {
    const currentUser = get().user;
    if (!currentUser) return; // safety check

    const updatedUser = { ...currentUser, ...updatedUserData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ token: null, user: null, isLoggedIn: false });
  },

  initialize: () => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    let user: loggedInUser | null = null;

    try {
      user = userStr ? (JSON.parse(userStr) as loggedInUser) : null;
    } catch {
      user = null;
    }

    if (token && user) {
      set({ token, user, isLoggedIn: true, isInitialized: true });
    } else {
      set({ isInitialized: true });
    }
  },
}));
