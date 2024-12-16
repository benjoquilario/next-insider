import { RequestHandler } from "express"
import { generateCsrfToken } from "../../utils/generateToken"

export const githubAuth: RequestHandler = (req, res) => {
  const endpoint = new URL("https://github.com/login/oauth/authorize")

  const csrfToken = generateCsrfToken()
  // @ts-ignore
  req.session.state = csrfToken

  const params: Record<string, string> = {
    client_id: process.env.GITHUB_CLIENT_ID as string,
    redirect_uri: process.env.GITHUB_REDIRECT_URI as string,
    scope: "read:user user:email",
    state: csrfToken,
  }
  for (const key in params) endpoint.searchParams.set(key, params[key])

  res.redirect(endpoint.toString())
}
