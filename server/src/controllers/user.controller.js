import { User } from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

export async function signUpUser(req, res) {
  const { name, email, password, confirmPassword } = req.body;

  if (!email || !password) {
    return res.status(405).json({ error: "Email and password are required!" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ error: "User already exists with this email" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Confirm password does not match to original!" });
  }
  const user = await User.create({ name, email, password });
  if (!user) return res.status(500).json({ error: "User not registered!" });

  const { password: _, ...safeUser } = user.toObject();

  return res.status(201).json({
    message: "User registered successfully",
    user: safeUser,
  });
}

export async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(405).json({ error: "Email and password are required!" });
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid)
    return res.status(409).json({ error: "Incorrect password" });

  const payload = { _id: user._id, email: user.email, name: user.name };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  res.cookie("fit_refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    message: "User logged in successfully",
    user: payload,
    accessToken,
  });
}

export function logoutUser(req, res) {
  res.clearCookie("fit_refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  res.status(200).json({ message: "Logged out successfully." });
}


export function getUser(req, res) {
  return res.json({ message: `Hello ${req.user.email}! This is protected.`, user: req.user })
}