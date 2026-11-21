import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import * as authApi from "../services/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // LOAD STORED AUTHENTICATION DATA
  // ============================================================
  useEffect(() => {
    const loadStoredUser = () => {
      try {
        const storedUser = localStorage.getItem(
          "fernwood_user"
        );

        if (!storedUser) {
          setUser(null);
          return;
        }

        const parsedUser = JSON.parse(storedUser);

        if (parsedUser?.token && parsedUser?.user) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem("fernwood_user");
          setUser(null);
        }
      } catch (error) {
        console.error(
          "Failed to load authentication data:",
          error
        );

        localStorage.removeItem("fernwood_user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadStoredUser();
  }, []);

  // ============================================================
  // SAVE AUTHENTICATION DATA
  // ============================================================
  const saveAuthData = (authData) => {
    localStorage.setItem(
      "fernwood_user",
      JSON.stringify(authData)
    );

    setUser(authData);

    window.dispatchEvent(
      new Event("fernwood:auth-updated")
    );
  };

  // ============================================================
  // LOGIN
  // ============================================================
  const login = async (credentials) => {
    const response = await authApi.login(credentials);

    const {
      token,
      user: authenticatedUser,
    } = response.data;

    if (!token || !authenticatedUser) {
      throw new Error(
        "Invalid login response from server."
      );
    }

    const authData = {
      token,
      user: authenticatedUser,
    };

    saveAuthData(authData);

    return response;
  };

  // ============================================================
  // REGISTER
  // ============================================================
  const register = async (registrationData) => {
    const response = await authApi.register(
      registrationData
    );

    const {
      token,
      user: registeredUser,
    } = response.data || {};

    if (token && registeredUser) {
      const authData = {
        token,
        user: registeredUser,
      };

      saveAuthData(authData);
    }

    return response;
  };

  // ============================================================
  // LOGOUT
  // ============================================================
  const logout = () => {
    authApi.logout();

    setUser(null);

    window.dispatchEvent(
      new Event("fernwood:auth-updated")
    );
  };

  // ============================================================
  // UPDATE USER
  // ============================================================
  const updateUser = (updatedUser) => {
    if (!updatedUser) return;

    setUser((currentAuthData) => {
      if (!currentAuthData) return currentAuthData;

      const updatedAuthData = {
        ...currentAuthData,
        user: {
          ...currentAuthData.user,
          ...updatedUser,
        },
      };

      localStorage.setItem(
        "fernwood_user",
        JSON.stringify(updatedAuthData)
      );

      return updatedAuthData;
    });

    window.dispatchEvent(
      new Event("fernwood:auth-updated")
    );
  };

  // ============================================================
  // CHANGE PASSWORD
  // ============================================================
  const changePassword = async (passwordData) => {
    return authApi.changePassword(passwordData);
  };

  // ============================================================
  // AUTHENTICATION STATUS
  // ============================================================
  const isAuthenticated = Boolean(
    user?.token && user?.user
  );

  // ============================================================
  // CONTEXT VALUE
  // ============================================================
  const value = {
    user: user?.user || null,
    token: user?.token || null,
    isAuthenticated,
    loading,

    login,
    register,
    logout,
    updateUser,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================================
// CUSTOM AUTH HOOK
// ============================================================
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider."
    );
  }

  return context;
};

export default AuthContext;