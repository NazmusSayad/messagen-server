import { checkType } from 'express-master'
import Group, { GroupDocument, POPULATE_GROUP } from '../../model/Group'
import { UserController } from '../types'
import { getAddedUser, getPendingUser, isGroupOwner } from './utils'

export type GroupController = UserController<{
  $group: GroupDocument
}>

export const getGroups: UserController = async (req, res, next) => {
  const usersQuery = { users: { $elemMatch: { user: req.user } } }
  const groups = await Group.find({
    $or: [{ owner: req.user }, usersQuery],
  }).populate(POPULATE_GROUP)

  res.success({ groups: groups })
}

export const createGroup: GroupController = async (req, res, next) => {
  const { name, avatar } = req.body
  checkType.string({ name })
  checkType.optional.string({ avatar })

  req.$group = new Group({ name, avatar, owner: req.user })
  next()
}

export const updateGroup: GroupController = async (req, res, next) => {
  const { name, avatar } = req.body
  checkType.string({ name })
  checkType.optional.string({ avatar })

  req.$group.set({ name, avatar })
  next()
}

export const deleteGroup: GroupController = async (req, res) => {
  if (isGroupOwner(req)) {
    await req.$group.remove()
  } else {
    const user = getAddedUser(req.$group.users, req.user._id)
    user.remove()
    await req.$group.save()
  }

  res.status(204).end()
}
