import express from 'express'
import { catchError } from 'req-error'
const router = express.Router()
export default router

import * as _tokenController from '../controller/auth/tokenController'
import * as _friendController from '../controller/friendController'

const tokenController = catchError(_tokenController)
const friendController = catchError(_friendController)

router.use(tokenController.checkAuthToken)

router
  .route('/')
  .get(friendController.getAllFriends)
  .post(friendController.addFriend)

router.delete('/:friendId', friendController.removeFriend)

router.patch('/accept/:friendId', friendController.acceptFriend)
