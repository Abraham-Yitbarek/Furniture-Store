import api from "./api";

/*
|--------------------------------------------------------------------------
| Authentication API
|--------------------------------------------------------------------------
| Handles all customer authentication-related requests.
|
| Backend route:
|   /api/auth
|
| Used by:
|   Login.jsx
|   Register.jsx
|   Profile.jsx
|   AuthContext.jsx
|--------------------------------------------------------------------------
*/

// ============================================================
// LOGIN
// POST /api/auth/login
// ============================================================

export const login = (data) => {
  return api.post("/auth/login", data);
};

// ============================================================
// REGISTER
// POST /api/auth/register
// ============================================================

export const register = (data) => {
  return api.post("/auth/register", data);
};

// ============================================================
// GET PROFILE
// GET /api/auth/profile
// Protected route
// ============================================================

export const getProfile = () => {
  return api.get("/auth/profile");
};

// ============================================================
// UPDATE PROFILE
// PUT /api/auth/profile
// Protected route
// ============================================================

export const updateProfile = (data) => {
  return api.put("/auth/profile", data);
};

// ============================================================
// CHANGE PASSWORD
// PUT /api/auth/change-password
// Protected route
// ============================================================

export const changePassword = (data) => {
  return api.put("/auth/change-password", data);
};

// ============================================================
// LOGOUT
// POST /api/auth/logout
// ============================================================

export const logout = () => {
  localStorage.removeItem("fernwood_user");

  window.dispatchEvent(
    new Event("fernwood:auth-updated")
  );
};

// ============================================================
// FORGOT PASSWORD
// POST /api/auth/forgot-password
// ============================================================

export const forgotPassword = (data) => {
  return api.post("/auth/forgot-password", data);
};

// ============================================================
// RESET PASSWORD
// POST /api/auth/reset-password
// ============================================================

export const resetPassword = (data) => {
  return api.post("/auth/reset-password", data);
};

// ============================================================
// VERIFY EMAIL
// POST /api/auth/verify-email
// ============================================================

export const verifyEmail = (data) => {
  return api.post("/auth/verify-email", data);
};