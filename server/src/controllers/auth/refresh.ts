import { RequestHandler } from "express"
import jwt from "jsonwebtoken"
import { verifyJwt } from "../../utils/verifyJwt"
import db from "../../db"

export const refresh: RequestHandler = async (req, res) => {
  const token = req.cookies?.refreshToken
  if (!token) {
    res
      .status(401)
      .json({ error: "Refresh token does not exist or has expired already." })
    return
  }

  try {
    const decoded = verifyJwt(token)
    const user = await db.user.findUnique({
      where: {
        id: decoded.sub as string,
      },
    })
    if (!user) {
      res.sendStatus(401)

      return
    }

    const accessToken = jwt.sign(
      { sub: user.id, name: user.name },
      process.env.JWT_SECRET as string,
      { expiresIn: "2h" }
    )
    res.send({ accessToken, user })
  } catch (error) {
    res.sendStatus(400)
  }
}
