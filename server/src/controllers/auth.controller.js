import { generateAccessToken, verifyRefreshToken } from "../utils/jwt.js"

export async function refreshToken(req, res) {
  const token = req.cookies.fit_refreshToken
  if(!token) {
    return res.status(401).json({ error: "No refresh token!" })
  }

  try {
    const decoded = verifyRefreshToken(token)
    const accessToken = generateAccessToken({
      _id: decoded._id,
      name: decoded.name,
      email: decoded.email,
    })
    return res.json({ accessToken })
  } catch (error) {
    return res.status(403).json({ error: "Invalid refresh token!" })
  }
}