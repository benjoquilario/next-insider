declare module "express-session" {
  interface SessionData {
    state: string
    codeVerifier: string
    nonce: string
  }
}

export {}
