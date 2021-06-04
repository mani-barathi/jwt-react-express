import { Router } from "express"
import bcrypt from "bcrypt"

import User from "../models/User.js"
import {
  createTokens,
  revokeRefreshTokens,
  sendRefreshTokenAsCookie,
  verifyRefreshToken,
} from "../utils/tokens.js"
import { isAuthenticated } from "../utils/middlewares.js"
import { COOKIE_NAME } from "../constants.js"

const router = Router()

// RANDOM
router.get("/random", isAuthenticated, (req, res) => {
  const no = Math.floor(Math.random() * 1000)
  return res.json({
    ok: true,
    data: `hello ${req.user.username} you got ${no}!`,
  })
})

/* (POST) verify the refresh token from cookie
 * returns - user, accessToken (sets new refreshToken in res as acookie)
 */
router.post("/refresh", async (req, res) => {
  const token = req.cookies[COOKIE_NAME]
  if (!token) {
    return res.json({ ok: false, message: "no token provided" })
  }

  const payload = verifyRefreshToken(token)
  if (!payload) {
    return res.json({ ok: false, message: "token expired" })
  }

  const user = await User.findById(payload._id).exec()
  if (!user) {
    return res.json({ ok: false, message: "no user exists with that token" })
  }

  if (user.tokenVersion !== payload.tokenVersion) {
    return res.json({ ok: false, message: "invalid token" })
  }

  const { accessToken, refreshToken } = await createTokens(user)
  sendRefreshTokenAsCookie(res, refreshToken)

  const { username, email, _id } = user
  return res.json({
    ok: true,
    data: { accessToken, user: { _id, username, email } },
  })
})

// SIGN UP
router.post("/signup", async (req, res) => {
  const data = req.body

  try {
    const oldUsers = await User.find({ email: data.email })
    if (oldUsers.length > 0) {
      return res.json({
        ok: false,
        message: `user already found with that email id`,
      })
    }

    data.password = await bcrypt.hash(data.password, 10)

    const newUser = new User(data)
    await newUser.save()
    const { username, email, _id } = newUser
    return res.json({
      ok: true,
      data: { username, email, _id },
    })
  } catch (e) {
    console.log("signup Error:", e)
    return res.json({
      ok: false,
      message: "something went wrong",
    })
  }
})

// LOGIN
router.post("/login", async (req, res) => {
  const data = req.body

  const user = await User.findOne({ email: data.email })
  if (!user)
    return res.json({
      ok: false,
      message: `No User Exists with a email of ${data.email}`,
    })

  const isCorrectPassword = await bcrypt.compare(data.password, user.password)
  if (!isCorrectPassword)
    return res.json({ message: `Invalid Credentials`, ok: false })

  const { accessToken, refreshToken } = await createTokens(user)
  sendRefreshTokenAsCookie(res, refreshToken)

  const { username, email, _id } = user
  return res.json({
    ok: true,
    data: { accessToken, user: { username, email, _id } },
  })
})

/* (POST) Logout by clearing refreshToken cookie from the browser
 * returns - none  (empties the cookie by setting the cookie to empty string)
 */
router.post("/logout", (_, res) => {
  sendRefreshTokenAsCookie(res, "")
  return res.json({ ok: true })
})

export default router
