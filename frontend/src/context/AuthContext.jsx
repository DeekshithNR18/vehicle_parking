import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("vp_user");
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("vp_token", res.data.token);
      localStorage.setItem("vp_user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.response?.data?.error || "Login failed" };
    }
  };

  const register = async (name, email, password, role = "resident") => {
    try {
      const res = await api.post("/auth/register", { name, email, password, role });
      localStorage.setItem("vp_token", res.data.token);
      localStorage.setItem("vp_user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.response?.data?.error || "Registration failed" };
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
      localStorage.setItem("vp_user", JSON.stringify(res.data.user));
    } catch (err) {
      console.error("Failed to refresh user", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("vp_token");
    localStorage.removeItem("vp_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
