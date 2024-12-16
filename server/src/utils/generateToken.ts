import { randomBytes, createHash } from "crypto"

export function base64URLEncode(input: Buffer): string {
  return input
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "")
}

export function generateRandomToken(bytes: number) {
  return randomBytes(bytes).toString("hex")
}

export function generateCsrfToken() {
  return generateRandomToken(16)
}

export function generatePkceTokens() {
  const codeVerifier = generateRandomToken(32)
  const codeVerifierBuffer = Buffer.from(codeVerifier)
  const codeChallenge = base64URLEncode(
    createHash("sha256").update(codeVerifierBuffer).digest()
  )

  return { codeVerifier, codeChallenge }
}


