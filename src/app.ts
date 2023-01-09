import express from 'express'
import expressExtra, { handleError } from 'express-master'
import cors from 'cors'
import xss from 'xss-clean'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import mongoSanitize from 'express-mongo-sanitize'
import router from './router'
import { requestLimit } from './core'
const app = expressExtra({ ping: '/ping' })

// Safety
app.use(
  cors({
    credentials: true,
    origin: Object.entries(process.env)
      .filter(([name]) => {
        return name.startsWith('CLIENT')
      })
      .map(([, value]) => value),
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
handleError(app)

export default app
