import { GithubEmails, GithubResponse } from "../../types/authTypes"

export async function getGithubAccessToken(code: string) {
  const endpoint = "https://github.com/login/oauth/access_token"

  const body = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code,
    redirect_uri: process.env.GITHUB_REDIRECT_URI as string,
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) throw Error("Failed to get access token from Github")
  return (await response.json()) as GithubResponse
}

export async function getGithubUser(accessToken: string) {
  const apiUrl = "https://api.github.com/user"
  const headers = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }

  const user = await fetch(apiUrl, headers)

  const userEmails = await fetch(`${apiUrl}/emails`, headers)

  if (!user.ok || !userEmails.ok)
    throw Error("Failed to get user data from Github")

  const emails = (await userEmails.json()) as GithubEmails
  const primaryEmail = emails.filter(
    ({ verified, primary }) => verified && primary
  )

  const { id, name, avatar_url } = await user.json()

  return {
    id,
    name,
    email: primaryEmail[0].email,
    image: avatar_url,
  }
}
