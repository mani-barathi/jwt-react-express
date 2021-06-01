import jwt from "jsonwebtoken"
import { PROD, SECRET1, SECRET2, COOKIE_NAME } from "../constants.js"

export const createTokens = async (userObj) => {
  const accessToken = await jwt.sign(userObj, SECRET1, {
    expiresIn: "15s", // in a real app this should be in minutes, (I've set it in seconds just for testing)
  })
  const refreshToken = await jwt.sign(userObj, SECRET2, {
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
