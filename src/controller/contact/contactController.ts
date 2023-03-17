import { checkType } from 'express-master'
import User from '../../model/User'
import { GroupController } from './contactCRUDController'
import { isContactOwner, getAddedUser, getPendingUser } from './utils'

export const verifyGroupAndOwner: GroupController = (req, res, next) => {
  if (!req.$contact.name) {
    throw new ReqError("You can't perform this action")
  }

  if (!isContactOwner(req)) {
    throw new ReqError('You need to be the owner for this action')
  }

  next()
}

export const inviteUser: GroupController = async (req, res, next) => {
  const { userId } = req.body
  checkType.string({ userId })
  await User.checkUserExists(userId)

  req.$contact.users.push({ user: userId, accepted: false })
  next()
}

export const removeUser: GroupController = async (req, res, next) => {
  const { userId } = req.params
  checkType.string({ userId })

  const user = getAddedUser(req.$contact.users, userId)
  user.remove()
  next()
}

export const acceptInvitation: GroupController = async (req, res, next) => {
  const user = getPendingUser(req.$contact.users, req.user._id)
  user.accepted = true
  next()
}
