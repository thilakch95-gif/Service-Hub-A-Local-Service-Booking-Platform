import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import client from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw || raw === "undefined") return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });

  const persistUser = useCallback((nextUser) => {
    localStorage.setItem("user", JSON.stringify(nextUser));
    setUser(nextUser);
    return nextUser;
  }, []);

  /* LOAD PROFILE FROM BACKEND */
  const loadProfile = useCallback(async (baseUser = null) => {
    try {
      const res = await client.get("/users/profile");
      const currentUser =
        baseUser ||
        (() => {
          try {
            const raw = localStorage.getItem("user");
            return raw ? JSON.parse(raw) : null;
          } catch {
            return null;
          }
        })();

      const updatedUser = {
        ...currentUser,
        userId: res.data.id ?? currentUser?.userId ?? null,
        fullName: res.data.fullName ?? currentUser?.fullName ?? "",
        email: res.data.email ?? currentUser?.email ?? "",
        role: res.data.role ?? currentUser?.role ?? "",
        phone: res.data.phone ?? currentUser?.phone ?? "",
        bio: res.data.bio ?? currentUser?.bio ?? "",
        profileImage: res.data.profileImage ?? currentUser?.profileImage ?? null,
        active: res.data.active ?? currentUser?.active ?? true,
      };

      return persistUser(updatedUser);
    } catch (err) {
      console.log("Profile load error:", err);
      return baseUser;
    }
  }, [persistUser]);

  /* LOGIN */
  const login = useCallback(async (payload) => {
    localStorage.setItem("token", payload.token);
    const baseUser = {
      userId: payload.userId,
      fullName: payload.fullName,
      email: payload.email,
      role: payload.role,
      phone: payload.phone || "",
      bio: payload.bio || "",
      profileImage: payload.profileImage || null,
      active: payload.active ?? true,
    };
    persistUser(baseUser);
    return loadProfile(baseUser);
  }, [loadProfile, persistUser]);

  /* LOGOUT */
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  /* UPDATE USER (profile edit updates navbar instantly) */
  const updateUser = useCallback((data) => {
    setUser((prev) => {
      const updatedUser = { ...prev, ...data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  /* AUTO LOAD PROFILE WHEN APP STARTS */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      loadProfile();
    }
  }, [loadProfile]);

  const value = useMemo(() => ({
    user,
    login,
    logout,
    updateUser,
    loadProfile
  }), [loadProfile, login, logout, updateUser, user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
