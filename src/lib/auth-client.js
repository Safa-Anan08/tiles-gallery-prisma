import apiClient from "./api-client";

export const authClient = {
  getToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  },

  setToken: (token) => {
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("accessToken", token);
      } else {
        localStorage.removeItem("accessToken");
      }
    }
  },

  getCurrentUser: async () => {
    const token = authClient.getToken();
    if (!token) return null;

    const res = await apiClient.get("/auth/me", { token });
    if (res.success && res.data) {
      return res.data;
    }
    return null;
  },

  login: async (email, password) => {
    const res = await apiClient.post("/auth/login", { email, password });
    if (res.success && res.data?.token) {
      authClient.setToken(res.data.token);
      return { success: true, user: res.data.user, token: res.data.token, message: res.message };
    }
    return { success: false, error: res.message || "Invalid credentials" };
  },

  register: async (name, email, password) => {
    const res = await apiClient.post("/auth/register", { name, email, password });
    if (res.success && res.data?.token) {
      authClient.setToken(res.data.token);
      return { success: true, user: res.data.user, token: res.data.token, message: res.message };
    }
    return { success: false, error: res.message || "Registration failed" };
  },

  googleLogin: async (credential) => {
    const res = await apiClient.post("/auth/google", { credential, idToken: credential });
    if (res.success && res.data?.token) {
      authClient.setToken(res.data.token);
      return { success: true, user: res.data.user, token: res.data.token, message: res.message };
    }
    return { success: false, error: res.message || "Google authentication failed" };
  },


  logout: async () => {
    const token = authClient.getToken();
    if (token) {
      await apiClient.post("/auth/logout", {}, { token });
    }
    authClient.setToken(null);
    return { success: true };
  },
};

export default authClient;