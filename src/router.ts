import { Router } from 'express'
const router = Router()
export default router
import authRoute from './routes/authRoute'
import userRoute from './routes/userRoute'

router.use('/auth', authRoute)
router.use('/user', userRoute)
