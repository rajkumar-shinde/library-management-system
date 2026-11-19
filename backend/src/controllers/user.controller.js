import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    // 1. Validate fields
    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 2. Check existing user
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "student",
    });

    // 5. Send response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    // 1. Validate fields
    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 2. Find user
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 3. Check account status
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive",
      });
    }

    // 4. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 5. Generate Access Token (15 minutes)
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    // 6. Generate Refresh Token (7 days)
    const refreshToken = jwt.sign(
      { id: user._id, type: "refresh" },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" },
    );

    // 7. Store refresh token hash in database
    user.refreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    await user.save();

    // 8. Send response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body || {};

    if (!refreshToken || typeof refreshToken !== "string") {
      return res.status(401).json({
        success: false,
        message: "Refresh token required",
      });
    }

    // 1. Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    if (decoded.type !== "refresh") {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // 2. Find user and stored token hash
    const user = await User.findById(decoded.id).select("+refreshToken");

    if (!user || !user.isActive || !user.refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // 3. Compare token hash
    const tokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    if (tokenHash !== user.refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // 4. Generate new access token
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    // 5. Rotate refresh token
    const newRefreshToken = jwt.sign(
      {
        id: user._id,
        type: "refresh",
        nonce: crypto.randomUUID(),
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" },
    );

    const newTokenHash = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");

    // Update only if old token is still current
    const result = await User.updateOne(
      { _id: user._id, refreshToken: tokenHash },
      { $set: { refreshToken: newTokenHash } },
    );

    if (result.modifiedCount !== 1) {
      return res.status(401).json({
        success: false,
        message: "Refresh token already used",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tokens refreshed successfully",
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $set: { refreshToken: null },
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export { registerUser, loginUser, refreshAccessToken, logoutUser };
