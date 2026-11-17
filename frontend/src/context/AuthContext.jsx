import { createContext, useContext, useState, useEffect, useCallback } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { api } from "../api";

const AuthContext = createContext(null);

// Convert a database row (membership_id) to the shape the pages use (membershipId)
const toUser = (u) => ({
  id: u.id,
  name: u.name,
  membershipId: u.membership_id,
  role: u.role,
});

export function AuthProvider({ children }) {
  // Only the logged-in user is kept in the browser, so a refresh doesn't log you out
  const [currentUser, setCurrentUser] = useLocalStorage("currentUser", null);
  const [users, setUsers] = useState([]);

  const loadUsers = useCallback(async () => {
    try {
      const data = await api.getUsers();
      setUsers(data.map(toUser));
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Only admins manage users, so only load the list for them
  useEffect(() => {
    if (currentUser?.role === "admin") loadUsers();
    else setUsers([]);
  }, [currentUser?.id, currentUser?.role, loadUsers]);

  const login = async (membershipId, password) => {
    try {
      const user = await api.login({
        membership_id: membershipId.trim(),
        password,
      });
      setCurrentUser(toUser(user));
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  };

  const logout = () => setCurrentUser(null);

  const addUser = async (data) => {
    try {
      await api.addUser({
        name: data.name,
        membership_id: data.membershipId,
        password: data.password,
        role: data.role,
      });
      await loadUsers();
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  };

  const updateUser = async (id, data) => {
    const target = users.find((u) => u.id === id);
    const adminCount = users.filter((u) => u.role === "admin").length;
    if (target?.role === "admin" && data.role !== "admin" && adminCount === 1) {
      return { ok: false, error: "There must be at least one admin" };
    }
    try {
      await api.updateUser(id, {
        name: data.name,
        membership_id: data.membershipId,
        role: data.role,
        password: data.password || undefined, // blank = keep the old password
      });
      await loadUsers();
      if (currentUser?.id === id) {
        setCurrentUser({
          ...currentUser,
          name: data.name,
          membershipId: data.membershipId,
          role: data.role,
        });
      }
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  };

  const deleteUser = async (id) => {
    if (id === currentUser?.id) {
      return { ok: false, error: "You cannot delete the account you are logged in with" };
    }
    try {
      await api.deleteUser(id);
      await loadUsers();
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  };

  const value = { users, currentUser, login, logout, addUser, updateUser, deleteUser };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}