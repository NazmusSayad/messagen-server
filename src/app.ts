import express from 'express'
import expressMaster from 'express-master'
import cors from 'cors'
import xss from 'xss-clean'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import mongoSanitize from 'express-mongo-sanitize'
import { requestLimit } from './core'
import router from './router'
const app = express()

// Safety
app.use(
  cors({
    credentials: true,
    /*    origin: Object.entries(process.env)
      .filter(([name]) => name.startsWith('CLIENT'))
      .map(([, value]) => value), */
    origin: /.*/,
  })
)
app.use(helmet())
app.use(requestLimit({ max: 1000 }))

// Pasrer
app.use(cookieParser())
app.use(express.json({ limit: '8kb' }))

// XXS
app.use(mongoSanitize())
app.use(xss())

// Routes
app.use(router)
expressMaster(app, { ping: '/ping' })

export default app
