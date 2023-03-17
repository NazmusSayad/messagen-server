import express from 'express'
import { catchError } from 'req-error'
const router = express.Router()
export default router

import * as _tokenController from '../controller/auth/tokenController'
import * as _groupController from '../controller/contact/contactController'
import * as _groupCRUDController from '../controller/contact/contactCRUDController'

const tokenController = catchError(_tokenController)
const contactController = catchError(_groupController)
const contactCRUDController = catchError(_groupCRUDController)

router.use(tokenController.checkAuthToken)

router
  .route('/')
  .get(contactCRUDController.getContacts)
  .post(
    contactCRUDController.createContact,
    contactCRUDController.saveAndSendContact
  )

// Set contact in the req object
router.all('/:contactId*', contactCRUDController.setContact)

router.delete(
  '/:contactId',
  contactCRUDController.deleteContact,
  contactCRUDController.saveAndSendContact
)
router.patch(
  '/:contactId/accept',
  contactController.acceptInvitation,
  contactCRUDController.saveAndSendContact
)

// Only for owner
router.use(contactController.verifyGroupAndOwner)

router.patch(
  '/:contactId',
  contactCRUDController.updateContact,
  contactCRUDController.saveAndSendContact
)

router.post(
  '/:contactId/members',
  contactController.inviteUser,
  contactCRUDController.saveAndSendContact
)
router.delete(
  '/:contactId/members/:userId',
  contactController.removeUser,
  contactCRUDController.saveAndSendContact
)
