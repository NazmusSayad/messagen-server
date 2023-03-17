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
  .post(groupCRUDController.createGroup, groupController.saveAndSendGroup)

router.all('/:groupId*', groupController.setGroup)
router
  .route('/:groupId/accept')
  .patch(groupController.acceptInvitation, groupController.saveAndSendGroup)

router.route('/:groupId').delete(groupCRUDController.deleteGroup)

// Only for owner
router.use(groupController.checkIfUserIsOwner)
router.route('/:groupId').delete(groupCRUDController.deleteGroup)

router.post(
  '/:groupId/members',
  groupController.inviteUser,
  groupController.saveAndSendGroup
)
router.delete(
  '/:groupId/members/:userId',
  groupController.removeUser,
  groupController.saveAndSendGroup
)
