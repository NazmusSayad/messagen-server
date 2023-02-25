import express from 'express'
import { catchError } from 'req-error'
const router = express.Router()
export default router
import * as _tokenController from '../controller/auth/tokenController'
import * as _authController from '../controller/auth/authController'
import * as _userController from '../controller/userController'

const tokenController = catchError(_tokenController)
const authController = catchError(_authController)
const userController = catchError(_userController)

router.post(
  '/delete-me',
  tokenController.checkAuthTokenNotVerified,
  authController.checkPassword,
  userController.deleteUser
)

router.use(tokenController.checkAuthToken)

router.route('/').get(userController.getUser).patch(userController.updateUser)

router.get('/search', userController.searchUser)

router.patch(
  '/username',
  authController.checkPassword,
  userController.updateUsername
)
router.patch(
  '/password',
  authController.checkPassword,
  userController.updatePassword,
  tokenController.sendCookieToken
)
router
  .route('/email')
  .post(userController.updateEmailRequest)
  .patch(authController.checkPassword, userController.updateEmail)
