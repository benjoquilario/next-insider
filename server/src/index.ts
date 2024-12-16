import express from "express"
import session from "express-session"
import cookieParser from "cookie-parser"
import cors from "cors"
import auth from "./routes/authRouter"

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cookieParser())

app.use(
  // @ts-ignore
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
)

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
)

app.get("/", (req, res) => {
  res.send("Hello World")
})

app.use("/auth", auth)

app.listen(PORT, () => console.log("Server is running on port " + PORT))
