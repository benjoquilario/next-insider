import { Response, Request } from "express"
import { getGithubAccessToken, getGithubUser } from "../services/auth/github"

export const oAuthCallback = async (req: Request, res: Response) => {
  const path = req.path

  try {
    if (path === "/github/callback") {
      const { access_token } = await getGithubAccessToken(
        req.query.code as string
      )

      res.locals.oAuthUser = await getGithubUser(access_token)
    }
  } catch (error) {
    res.sendStatus(500)
  }
}
