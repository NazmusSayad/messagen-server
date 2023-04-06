import { Types } from 'mongoose'
import { ContactDocument, POPULATE_CONTACT } from '../../model/Contact'
import { GroupController } from './contactCRUDController'

export const getPendingUser = (
  users: ContactDocument['users'],
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
  users: ContactDocument['users'],
  userId: Types.ObjectId | string,
  error = true
) => {
  userId = userId.toString()
  const joinedUser = users.find((user) => user.user.toString() === userId)
  if (error && !joinedUser) throw new ReqError('No user found here')
  return joinedUser
}

export const isContactOwner = (req: Parameters<GroupController>[0]) => {
  return req.$contact.owner.toString() === req.user._id.toString()
}

export const getRoomsFromContact = (contact: ContactDocument, exclude = '') => {
  const rooms = [
    contact.owner._id.toString(),
    ...contact.users.map((user) => user.user._id.toString()),
  ]
  return exclude ? rooms.filter((r) => r !== exclude) : rooms
}
