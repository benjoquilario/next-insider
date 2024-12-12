import express from "express"
import session from "express-session"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
