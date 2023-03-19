import { Types } from 'mongoose'
import { ContactDocument } from '../../model/Contact'
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
  userId: Types.ObjectId | string
) => {
  userId = userId.toString()
  const joinedUser = users.find((user) => user.user.toString() === userId)
  if (!joinedUser) throw new ReqError('No user found here')
  return joinedUser
}

export const isContactOwner = (req: Parameters<GroupController>[0]) => {
  return req.$contact.owner.toString() === req.user._id.toString()
}

export const getRoomsFromContact = (contact: ContactDocument, exclude = '') => { 
  const rooms: string[] = [
    contact.owner._id.toString(),
    ...contact.users.map((user) => user.user._id.toString()),
  ]

  if (!exclude) return rooms
  return rooms.filter((room) => room !== exclude)
}
