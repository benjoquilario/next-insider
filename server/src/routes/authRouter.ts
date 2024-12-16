import express from "express"
import { githubAuth } from "../controllers/auth/github"
import { verifyCsrfToken } from "../middlewares/verifyCsrfToken"
import { oAuthCallback } from "../middlewares/oAuthCallback"
import { login } from "../middlewares/login"

const router = express.Router()

router.get("/github", githubAuth)
router.get("/github/callback", verifyCsrfToken, oAuthCallback, login)

export default router
