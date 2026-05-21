import { create } from "zustand";
import { api } from "../lib/axios";
import { jwtDecode } from "jwt-decode";

interface User {
  id: number;
  username: string;
  role: string;
}

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setToken: (token: string) => void;
}

const getUserFromToken = (): User | null => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  try {
    return jwtDecode<User>(token);
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: getUserFromToken(),
  accessToken: localStorage.getItem("accessToken"),

  login: async (username, password) => {
    const { data } = await api.post("/auth/login", { username, password });
    localStorage.setItem("accessToken", data.data.accessToken);
    set({
      accessToken: data.data.accessToken,
      user: jwtDecode<User>(data.data.accessToken),
    });
  },

  logout: async () => {
    await api.post("/auth/logout");
    localStorage.removeItem("accessToken");
    set({ user: null, accessToken: null });
  },

  setToken: (token) => {
    localStorage.setItem("accessToken", token);
    set({ accessToken: token });
  },
}));
