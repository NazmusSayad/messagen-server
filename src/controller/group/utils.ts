import { Types } from 'mongoose'
import { GroupDocument } from '../../model/Group'
import { GroupController } from './groupCRUDController'

export const getPendingUser = (
  users: GroupDocument['users'],
  userId: Types.ObjectId | string
) => {
  userId = userId.toString()

  const joinedUser = users.find(
    (user) => user.user.toString() === userId && user.accepted === false
  )
  if (!joinedUser) throw new ReqError('User not invited to join this')

  return joinedUser
}

export const getAddedUser = (
  users: GroupDocument['users'],
  userId: Types.ObjectId | string,
  reverse = false
) => {
  userId = userId.toString()
  const joinedUser = users.find((user) => user.user.toString() === userId)

  if (!reverse && !joinedUser) throw new ReqError('No user found here')
  if (reverse && joinedUser)
    throw new ReqError('User already inside this group')

  return joinedUser
}

export const isGroupOwner = (req: Parameters<GroupController>[0]) => {
  return req.$group.owner.toString() === req.user._id.toString()
}
