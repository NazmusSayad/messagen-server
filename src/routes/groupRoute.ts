import express from 'express'
import { catchError } from 'req-error'
const router = express.Router()
export default router

import * as _tokenController from '../controller/auth/tokenController'
import * as _groupController from '../controller/group/groupController'
import * as _groupCRUDController from '../controller/group/groupCRUDController'

const tokenController = catchError(_tokenController)
const groupController = catchError(_groupController)
const groupCRUDController = catchError(_groupCRUDController)

router.use(tokenController.checkAuthToken)

router
  .route('/')
  .get(groupCRUDController.getGroups)
  .post(groupCRUDController.createGroup)

router.all('/:groupId*', groupController.setGroup)
router.post(
  '/:groupId/members/:userId/accept',
  groupController.acceptInvitation
)

router.use(groupController.checkIfUserIsOwner)
router
  .route('/:groupId')
  .patch(groupCRUDController.updateGroup)
  .delete(groupCRUDController.deleteGroup)

router.post('/:groupId/members', groupController.inviteUser)
router.delete('/:groupId/members/:userId', groupController.removeUser)
