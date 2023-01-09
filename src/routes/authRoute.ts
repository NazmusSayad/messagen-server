import express from 'express'
import { catchError } from 'req-error'
const router = express.Router()
export default router
import * as _tokenController from '../controller/auth/tokenController'
import * as _authController from '../controller/auth/authController'
import { requestLimit } from '../core'

const tokenController = catchError(_tokenController)
const authController = catchError(_authController)

router.all('/clear', tokenController.clearCookieToken)
router.get(
  '/token',
  tokenController.getAuthToken,
  tokenController.sendCookieToken
)

router.post('/login', authController.login, tokenController.sendCookieToken)
router.post(
  '/signup',
  requestLimit({ max: 10 }),
  authController.signup,
  tokenController.sendCookieToken
)

router.post(
  '/acc-verification',
  tokenController.checkAuthTokenNotVerified,
  authController.verifyAccount
)
router.post(
  '/resend-acc-verification',
  requestLimit({ max: 5, duration: 600000 /* 10 min */ }),
  tokenController.checkAuthTokenNotVerified,
  authController.resendAccVerifyCode
)

router.post(
  '/request-password-reset',
  requestLimit({ max: 5, duration: 600000 /* 10 min */ }),
  authController.requestPassReset
)
router.post(
  '/reset-password',
  authController.resetPassword,
  tokenController.sendCookieToken
)
