import jwt from "jsonwebtoken"
import { PROD, SECRET1, SECRET2, COOKIE_NAME } from "../constants.js"
import User from "../models/User.js"

export const createTokens = async (user) => {
  const { username, _id, tokenVersion } = user
  const payload = { username, _id }

  const accessToken = jwt.sign(payload, SECRET1, {
    expiresIn: "15s", // in a real app this should be in minutes, (I've set it in seconds just for testing)
  })

  // tokenVersion is needed only in refreshToken
  payload.tokenVersion = tokenVersion
  const refreshToken = jwt.sign(payload, SECRET2, {
    expiresIn: "7d",
  })

  return { accessToken, refreshToken }
}

export const verifyAccessToken = (accessToken) => {
  try {
    const data = jwt.verify(accessToken, SECRET1)
    return data
  } catch (error) {
    return null
  }
}

export const verifyRefreshToken = (refreshToken) => {
  try {
    const data = jwt.verify(refreshToken, SECRET2)
    return data
  } catch (error) {
    return null
  }
}

export const sendRefreshTokenAsCookie = (res, refreshToken) => {
  res.cookie(COOKIE_NAME, refreshToken, {
    httpOnly: true,
    path: "api/auth/refresh",
    secure: PROD,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  })
}

// If the user has changed or forgotten the password
// by inc the tokenVersion, all the previous refreshTokens will become invalid
export const revokeRefreshTokens = async (_id) => {
  await User.findOneAndUpdate({ _id }, { $inc: { tokenVersion: 1 } }).exec()
  return true
}
