import { Router } from 'express'
const router = Router()
export default router

import authRoute from './routes/authRoute'
import userRoute from './routes/userRoute'
import friendRoute from './routes/friendRoute'

router.use('/auth', authRoute)
router.use('/account', userRoute)
router.use('/friends', friendRoute)
