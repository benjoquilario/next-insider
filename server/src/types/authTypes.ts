export interface GithubResponse {
  access_token: string
  token_type: string
  scope: string
}

export type GithubEmails = Array<{
  email: string
  verified: boolean
  primary: boolean
  visibility: string
}>

export type OAuthProviders = "github" | "google"

export interface Account {
  id: string
  provider: OAuthProviders
  providerAccountId: string
  userId: string
}

export interface OAuthUser {
  id: string
  name: string
  email?: string | null
  image?: string | null
}
