import { Router } from 'express'
const router = Router()
export default router

import authRoute from './routes/authRoute'
import userRoute from './routes/userRoute'
import contactRoute from './routes/contactRoute'
import messagesRoute from './routes/messagesRoute'

router.use('/auth', authRoute)
router.use('/account', userRoute)
router.use('/contacts', contactRoute)
router.use('/messages', messagesRoute)
