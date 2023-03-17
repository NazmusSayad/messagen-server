import { checkType } from 'express-master'
import Group, { POPULATE_GROUP } from '../../model/Group'
import User from '../../model/User'
import { GroupController } from './groupCRUDController'
import { isGroupOwner, getAddedUser, getPendingUser } from './utils'

export const setGroup: GroupController = async (req, res, next) => {
  const { groupId } = req.params
  checkType.string({ groupId })

  const group = await Group.findById(groupId)
  if (!group) throw new ReqError('No group found')

  req.$group = group
  next()
}

export const saveAndSendGroup: GroupController = async (req, res) => {
  const group = await req.$group.save()
  res.success({
    group: await group.populate(POPULATE_GROUP),
  })
}

export const checkIfUserIsOwner: GroupController = (req, res, next) => {
  if (!isGroupOwner(req)) {
    throw new ReqError('You need to be the owner for this action')
  }

  next()
}

export const inviteUser: GroupController = async (req, res, next) => {
  const { userId } = req.body
  checkType.string({ userId })

  const isExists = await User.exists({ _id: userId })
  if (!isExists || req.$group.owner.toString() === userId) {
    throw new ReqError('User does not exists')
  }

  getAddedUser(req.$group.users, userId, true)
  req.$group.users.push({ user: userId, accepted: false })
  next()
}

export const removeUser: GroupController = async (req, res, next) => {
  const { userId } = req.params
  checkType.string({ userId })

  const user = getAddedUser(req.$group.users, userId)
  user.remove()
  next()
}

export const acceptInvitation: GroupController = async (req, res, next) => {
  const user = getPendingUser(req.$group.users, req.user._id)
  user.accepted = true
  next()
}
