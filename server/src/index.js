import express from 'express'
import { config } from 'dotenv'
import userRouter from './routes/user.route.js'
import profileRouter from './routes/profile.route.js'
import { connectDB } from './db/db.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { refreshToken } from './controllers/auth.controller.js'

config()

const app = express()
const PORT = process.env.PORT || 8000
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017"
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173"

app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())

connectDB(MONGO_URL)

app.use('/api/user', userRouter)
app.use('/api/refresh-token', refreshToken)
app.use('/api/profile', profileRouter)

app.get('/', (_, res) => {
  return res.send("Hello from server")
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})