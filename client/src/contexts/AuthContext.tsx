import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Role = "user" | "driver" | "admin";

interface User {
  id: string;
  phone?: string;
  email?: string;
  role: Role;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password: string, role: Role) => Promise<void>;
  register: (data: { name: string; phone: string; password: string; vehicle_no?: string; role: Role }) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const BACKEND_URL = "http://localhost:8000/api/v1";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("rapido_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (identifier: string, password: string, role: Role) => {
    setError(null);
    try {
      let endpoint = "/users/login";
      let body: any = { password };
      
      if (role === "admin") {
        endpoint = "/admin/login";
        body.email = identifier;
      } else {
        if (role === "driver") endpoint = "/drivers/login";
        body.phone = identifier;
      }

      const res = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Login failed");
      
      const userData = { ...data, role };
      setUser(userData);
      localStorage.setItem("rapido_user", JSON.stringify(userData));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const register = async ({ name, phone, password, vehicle_no, role }: { name: string; phone: string; password: string; vehicle_no?: string; role: Role }) => {
    setError(null);
    try {
      const endpoint = role === "driver" ? "/drivers/" : "/users/";
      const body = role === "driver" ? { name, phone, password, vehicle_no } : { name, phone, password };
      
      const res = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Registration failed");

      const userData = { ...data, role };
      setUser(userData);
      localStorage.setItem("rapido_user", JSON.stringify(userData));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("rapido_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
