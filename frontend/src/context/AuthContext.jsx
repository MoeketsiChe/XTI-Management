import { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const AuthContext = createContext(null);

const defaultUsers = [
  { id: 1, name: "Administrator", membershipId: "ADMIN001", role: "admin", password: "admin123" },
];

export function AuthProvider({ children }) {
  const [users, setUsers] = useLocalStorage("users", defaultUsers);
  const [currentUserId, setCurrentUserId] = useLocalStorage("currentUserId", null);

  const currentUser = users.find((u) => u.id === currentUserId) || null;

  const login = (membershipId, password) => {
    const user = users.find(
      (u) =>
        u.membershipId.toLowerCase() === membershipId.trim().toLowerCase() &&
        u.password === password
    );
    if (!user) return { ok: false, error: "Invalid membership ID or password" };
    setCurrentUserId(user.id);
    return { ok: true };
  };

  const logout = () => setCurrentUserId(null);

  const addUser = (data) => {
    setUsers((prev) => [...prev, { ...data, id: Date.now() }]);
    return { ok: true };
  };

  const updateUser = (id, data) => {
    const target = users.find((u) => u.id === id);
    const adminCount = users.filter((u) => u.role === "admin").length;
    if (target.role === "admin" && data.role !== "admin" && adminCount === 1) {
      return { ok: false, error: "There must be at least one admin" };
    }
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, ...data, password: data.password ? data.password : u.password }
          : u
      )
    );
    return { ok: true };
  };

  const deleteUser = (id) => {
    if (id === currentUserId) {
      return { ok: false, error: "You cannot delete the account you are logged in with" };
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
    return { ok: true };
  };

  const value = { users, currentUser, login, logout, addUser, updateUser, deleteUser };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}