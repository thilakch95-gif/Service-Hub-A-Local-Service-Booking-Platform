import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import client from "../api/client";

const AuthContext = createContext(null);

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw || raw === "undefined") return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const readStoredToken = () => {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);
  const [isBootstrapping, setIsBootstrapping] = useState(() => Boolean(readStoredToken()) && !readStoredUser());

  const persistUser = useCallback((nextUser) => {
    localStorage.setItem("user", JSON.stringify(nextUser));
    setUser(nextUser);
    return nextUser;
  }, []);

  /* LOAD PROFILE FROM BACKEND */
  const loadProfile = useCallback(async (baseUser = null) => {
    try {
      const res = await client.get("/users/profile");
      const currentUser = baseUser || readStoredUser();

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

      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        return null;
      }

      return baseUser;
    } finally {
      setIsBootstrapping(false);
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
    const persistedUser = persistUser(baseUser);
    setIsBootstrapping(false);
    void loadProfile(baseUser);
    return persistedUser;
  }, [loadProfile, persistUser]);

  /* LOGOUT */
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsBootstrapping(false);
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
    const token = readStoredToken();
    const storedUser = readStoredUser();

    if (!token) {
      setIsBootstrapping(false);
      return;
    }

    if (!storedUser) {
      setIsBootstrapping(true);
    }

    void loadProfile(storedUser);
  }, [loadProfile]);

  const value = useMemo(() => ({
    user,
    isBootstrapping,
    login,
    logout,
    updateUser,
    loadProfile
  }), [isBootstrapping, loadProfile, login, logout, updateUser, user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
