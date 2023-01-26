import express from 'express'
import { catchError } from 'req-error'
const router = express.Router()
export default router

import * as _tokenController from '../controller/auth/tokenController'
import * as _groupController from '../controller/groupController'

const tokenController = catchError(_tokenController)
const groupController = catchError(_groupController)

router.use(tokenController.checkAuthToken)

router
  .route('/')
  .get(groupController.getGroups)
  .post(groupController.createGroup)

router
  .route('/:groupId')
  .patch(groupController.updateGroup)
  .delete(groupController.deleteGroup)

router.post('/members', groupController.inviteUser)
router.delete('/members/:userId', groupController.removeUser)
router.post('/members/:userId/accept', groupController.acceptInvitation)
