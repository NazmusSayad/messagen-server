import express from 'express'
import { catchError } from 'req-error'
const router = express.Router()
export default router
import * as _tokenController from '../controller/auth/tokenController'
import * as _messageController from '../controller/message/messageController'
import multer from '../utils/file/multer'

const tokenController = catchError(_tokenController)
const messageController = catchError(_messageController)

router.use(tokenController.checkAuthToken)
router.post('/', multer().array('images'), messageController.createMessage)
