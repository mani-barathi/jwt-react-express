import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"

// Routes
import authRoutes from "./routes/auth.js"

import { CORS_ORIGIN, MONGO_DB_URL, PORT } from "./constants.js"

const main = async () => {
  await mongoose.connect(MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  const app = express()

  app.use(
    cors({
      origin: CORS_ORIGIN,
      credentials: true,
    })
  )

  app.use(cookieParser())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.get("/", (_, res) => res.send("Hello World!"))

  app.use("/api/auth", authRoutes)

  app.listen(PORT, () => console.log(`URL: http://localhost:${PORT}`))
}

main()
