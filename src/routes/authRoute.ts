import express from 'express'
import { catchError } from 'req-error'
const router = express.Router()
export default router

import * as _tokenController from '../controller/auth/tokenController'
const tokenController = catchError(_tokenController)

router.use('/clear', tokenController.clearToken)
router.get('/', (req) => {})
