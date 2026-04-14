import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type UserRole = "admin" | "doctor" | "patient";

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  users: StoredUser[];
  login: (user: AuthUser) => void;
  signIn: (email: string, password: string, role?: UserRole) => { ok: true } | { ok: false; message: string };
  signUp: (input: SignUpInput) => { ok: true } | { ok: false; message: string };
  logout: () => void;
}

interface StoredUser extends AuthUser {
  email: string;
  password: string;
}

interface SignUpInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USERS_KEY = "organixis-auth-users";
const AUTH_SESSION_KEY = "organixis-auth-session";

const defaultUsers: StoredUser[] = [
  { id: "admin-1", name: "Admin User", email: "admin@organixis.app", password: "admin123", role: "admin" },
  { id: "d1", name: "Dr. Sarah Chen", email: "doctor@organixis.app", password: "doctor123", role: "doctor" },
  { id: "p1", name: "Alice Johnson", email: "patient@organixis.app", password: "patient123", role: "patient" },
];

function readUsersFromStorage(): StoredUser[] {
  if (typeof window === "undefined") return defaultUsers;
  try {
    const raw = window.localStorage.getItem(AUTH_USERS_KEY);
    if (!raw) return defaultUsers;
    const parsed = JSON.parse(raw) as StoredUser[];
    return parsed.length > 0 ? parsed : defaultUsers;
  } catch {
    return defaultUsers;
  }
}

function readSessionFromStorage(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<StoredUser[]>(defaultUsers);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUsers(readUsersFromStorage());
    setUser(readSessionFromStorage());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
  }, [users]);

  const login = (u: AuthUser) => {
    setUser(u);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(u));
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(AUTH_SESSION_KEY);
    }
  };

  const signIn: AuthContextType["signIn"] = (email, password, role) => {
    const normalizedEmail = email.trim().toLowerCase();
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === normalizedEmail &&
        u.password === password &&
        (!role || u.role === role)
    );
    if (!found) return { ok: false, message: "Invalid credentials." };
    login({ id: found.id, name: found.name, role: found.role });
    return { ok: true };
  };

  const signUp: AuthContextType["signUp"] = ({ name, email, password, role }) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      return { ok: false, message: "Email already exists." };
    }
    const newUser: StoredUser = {
      id: `${role}-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      password,
      role,
    };
    setUsers((prev) => [...prev, newUser]);
    login({ id: newUser.id, name: newUser.name, role: newUser.role });
    return { ok: true };
  };

  return (
    <AuthContext.Provider value={{ user, users, login, signIn, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
