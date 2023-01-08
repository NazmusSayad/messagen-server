import { Router } from 'express'
const router = Router()
export default router
import authRoute from './routes/authRoute'

router.use('/auth', authRoute)
