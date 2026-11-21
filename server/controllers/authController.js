import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ============================================================
// Generate JWT
// ============================================================
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      is_admin: user.is_admin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

// ============================================================
// Remove password from user response
// ============================================================
const sanitizeUser = (user) => {
  if (!user) return null;

  const { password, ...safeUser } = user;

  return safeUser;
};

// ============================================================
// REGISTER USER
// POST /api/auth/register
// ============================================================
export const registerUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      profile_picture,
    } = req.body;

    // --------------------------------------------------------
    // Validation
    // --------------------------------------------------------
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "First name, last name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedFirstName = first_name.trim();
    const normalizedLastName = last_name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedFirstName || !normalizedLastName) {
      return res.status(400).json({
        success: false,
        message: "First name and last name cannot be empty",
      });
    }

    // --------------------------------------------------------
    // Check existing user
    // --------------------------------------------------------
    const existingUser = await User.findByEmail(normalizedEmail);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // --------------------------------------------------------
    // Hash password
    // --------------------------------------------------------
    const hashedPassword = await bcrypt.hash(password, 12);

    // --------------------------------------------------------
    // Create user
    // --------------------------------------------------------
    const user = await User.create({
      first_name: normalizedFirstName,
      last_name: normalizedLastName,
      email: normalizedEmail,
      address: { phone: req.body.phone,},
      password: hashedPassword,
      profile_picture: profile_picture || null,
      isAdmin: false,
    });

    if (!user) {
      return res.status(500).json({
        success: false,
        message: "Failed to create user",
      });
    }

    // --------------------------------------------------------
    // Generate token
    // --------------------------------------------------------
    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Register user error:", error);

    // PostgreSQL unique violation
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

// ============================================================
// LOGIN USER
// POST /api/auth/login
// ============================================================
export const loginUser = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // --------------------------------------------------------
    // Validation
    // --------------------------------------------------------
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // --------------------------------------------------------
    // Find user
    // --------------------------------------------------------
    const user = await User.findByEmail(normalizedEmail);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // --------------------------------------------------------
    // Compare password
    // --------------------------------------------------------
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // --------------------------------------------------------
    // Generate token
    // --------------------------------------------------------
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Login user error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// ============================================================
// GET CURRENT USER PROFILE
// GET /api/auth/profile
// Protected route
// ============================================================
export const getProfile = async (req, res) => {
  try {
    // authMiddleware should set req.user
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

// ============================================================
// UPDATE PROFILE
// PUT /api/auth/profile
// Protected route
// ============================================================
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const {
      first_name,
      last_name,
      email,
      profile_picture,
      phone,
      address,
    } = req.body;

    // --------------------------------------------------------
    // Validate
    // --------------------------------------------------------
    if (
      first_name === undefined &&
      last_name === undefined &&
      email === undefined &&
      profile_picture === undefined &&
      phone === undefined &&
      address === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required",
      });
    }

    const normalizedEmail =
      email !== undefined
        ? email.trim().toLowerCase()
        : undefined;

    const normalizedFirstName =
      first_name !== undefined
        ? first_name.trim()
        : undefined;

    const normalizedLastName =
      last_name !== undefined
        ? last_name.trim()
        : undefined;

    // --------------------------------------------------------
    // Validate names if provided
    // --------------------------------------------------------
    if (
      first_name !== undefined &&
      !normalizedFirstName
    ) {
      return res.status(400).json({
        success: false,
        message: "First name cannot be empty",
      });
    }

    if (
      last_name !== undefined &&
      !normalizedLastName
    ) {
      return res.status(400).json({
        success: false,
        message: "Last name cannot be empty",
      });
    }

    // --------------------------------------------------------
    // Validate email if provided
    // --------------------------------------------------------
    if (email !== undefined && !normalizedEmail) {
      return res.status(400).json({
        success: false,
        message: "Email cannot be empty",
      });
    }

    // --------------------------------------------------------
    // If changing email, check whether already used
    // --------------------------------------------------------
    if (normalizedEmail) {
      const existingUser = await User.findByEmail(
        normalizedEmail
      );

      if (
        existingUser &&
        Number(existingUser.id) !== Number(userId)
      ) {
        return res.status(409).json({
          success: false,
          message: "Email is already in use",
        });
      }
    }

    // --------------------------------------------------------
    // Update user
    // --------------------------------------------------------
    const updatedUser = await User.update(userId, {
      first_name: normalizedFirstName,
      last_name: normalizedLastName,
      email: normalizedEmail,
      profile_picture:
        profile_picture !== undefined
          ? profile_picture
          : undefined,
      phone:
        phone !== undefined
          ? phone.trim()
          : undefined,
      address,
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: sanitizeUser(updatedUser),
    });
  } catch (error) {
    console.error("Update profile error:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Email is already in use",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

// ============================================================
// CHANGE PASSWORD
// PUT /api/auth/change-password
// Protected route
// ============================================================
export const changePassword = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const {
      currentPassword,
      newPassword,
    } = req.body;

    // --------------------------------------------------------
    // Validation
    // --------------------------------------------------------
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be at least 6 characters",
      });
    }

    // --------------------------------------------------------
    // Get user
    // --------------------------------------------------------
    const user = await User.findByIdWithPassword(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // --------------------------------------------------------
    // Verify current password
    // --------------------------------------------------------
    const passwordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // --------------------------------------------------------
    // Hash new password
    // --------------------------------------------------------
    const hashedPassword = await bcrypt.hash(
      newPassword,
      12
    );

    // --------------------------------------------------------
    // Update password
    // --------------------------------------------------------
    const updatedUser = await User.updatePassword(
      userId,
      hashedPassword
    );

    if (!updatedUser) {
      return res.status(500).json({
        success: false,
        message: "Failed to change password",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
};

// ============================================================
// LOGOUT
// POST /api/auth/logout
// ============================================================
export const logoutUser = async (req, res) => {
  try {
    // JWT is stateless.
    // The frontend should remove the stored token.
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to logout",
    });
  }
};