import { Response } from 'express'
import { UserRequest } from './auth/tokenController'
import Friend from '../model/Friend'
import { checkType } from 'express-master'
import { getSuccess } from '../utils'

export const getAllFriends = async (req: UserRequest, res: Response) => {
  const friends = await Friend.find({
    $or: [{ user: req.user }, { friend: req.user }],
  })

  res.success({ friends })
}

export const addFriend = async (req: UserRequest, res: Response) => {
  const friendId = req.body.friend
  checkType.string({ friend: friendId })
  if (req.user._id.toString() === friendId) {
    throw new ReqError("You can't add yourself as a friend")
  }

  const friend = await Friend.create({ user: req.user, friend: friendId })

  const data = res.success({ friend })
  req.io.sendTo('$friend/post', friendId, data)
}

export const removeFriend = async (req: UserRequest, res: Response) => {
  const friendId = req.params.id
  checkType.string({ friend: friendId })

  const friend = await Friend.deleteOne({ user: req.user, friend: friendId })
  if (!friend.deletedCount) {
    throw new ReqError('No friend found with this id')
  }

  res.status(204).end()
  req.io.sendTo('$friend/delete', friendId, getSuccess({ friend: friendId }))
}

export const acceptFriend = async (req: UserRequest, res: Response) => {
  const friendId = req.params.id
  checkType.string({ friend: friendId })

  const friend = await Friend.findOne({
    user: req.user,
    friend: friendId,
    accepted: false,
  })
  if (!friend) throw new ReqError('No pending request found with this info')

  friend.accepted = true
  const data = res.success({ friend: await friend.save() })
  req.io.sendTo('$friend/accept', friendId, data)
}
