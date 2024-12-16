import { verifyJwt } from "../utils/verifyJwt"
import { RequestHandler } from "express"

export const verifyLogin: RequestHandler = (req, res, next) => {
  const authHeader = req.headers["authorization"]

  if (authHeader) {
    if (authHeader.startsWith("Bearer ")) {
      const token = authHeader.slice(7)

      try {
        const payload = verifyJwt(token)

        res.locals.userId = payload.sub
      } catch (error) {
        res.status(401).json({ error: "Access token is invalid" })

        return
      }
    } else {
      res.status(401).json({ error: "Access token must be provided" })
      return
    }
  } else {
    res.status(401).json({ error: "Access token must be provided" })

    return
  }

  next()
}
