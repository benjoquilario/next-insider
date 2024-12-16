import { RequestHandler } from "express"

export const logout: RequestHandler = (req, res) => {
  const token = req.cookies?.refreshToken
  if (!token) {
    res.sendStatus(401)

    return
  }

  res.clearCookie("refreshToken", { httpOnly: true, path: "/auth/refresh" })
  res.sendStatus(200)
}
