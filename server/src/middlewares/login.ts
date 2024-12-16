import { Request, Response } from "express"
import { type OAuthUser } from "../types/authTypes"
import db from "../db"
import jwt from "jsonwebtoken"

export const login = async (req: Request, res: Response): Promise<any> => {
  const { id: oAuthId, name, email, image } = res.locals.oAuthUser as OAuthUser

  const providerAccountId = oAuthId.toString()

  const account = await db.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider: "github",
        providerAccountId,
      },
    },
  })

  let userId: string

  if (!account) {
    const createUser = await db.user.create({
      data: {
        name,
        email,
        image,
      },
    })

    await db.account.create({
      data: {
        provider: "github",
        providerAccountId,
        userId: createUser.id,
        type: "oauth",
      },
    })

    userId = createUser.id
  } else {
    userId = account.userId
  }

  const refreshToken = jwt.sign(
    { sub: userId, name },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "90d",
    }
  )

  res.cookie("refreshToken", refreshToken, {
    maxAge: 30 * 60 * 60 * 1000,
    httpOnly: true,
    path: "/auth/refresh",
  })

  res.redirect("http://localhost:5173")
}
