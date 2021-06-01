import { verifyAccessToken } from "./tokens.js"

export const isAuthenticated = (req, res, next) => {
  try {
    const { authorization } = req.headers
    const token = authorization.split(" ")[1]

    const payload = verifyAccessToken(token)
    if (!payload) {
      throw new Error("invalid token")
    }
    req.user = payload
    return next()
  } catch (e) {
    res.status(401).json({ ok: false, message: "not authorized" })
  }
}
