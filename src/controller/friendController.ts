import Friend from '../model/Friend'
import { checkType } from 'express-master'
import { getSuccess } from '../utils'
import User, { userSafeInfo } from '../model/User'
import { UserController } from './types'

export const getAllFriends: UserController = async (req, res) => {
  const friends = await Promise.all([
    Friend.find({ user: req.user }).populate({
      path: 'friend',
      select: userSafeInfo,
    }),

    Friend.find({ friend: req.user }).populate({
      path: 'user',
      select: userSafeInfo,
    }),
  ])

  res.success({ friends: friends.flat(1) })
}

export const addFriend: UserController = async (req, res) => {
  const friendId = req.body.friend
  checkType.string({ friend: friendId })
  if (req.user._id.toString() === friendId) {
    throw new ReqError("You can't add yourself as a friend")
  }

  const userFriendDoc = await User.findById(friendId)
  if (!userFriendDoc) throw new ReqError('No friend found')
  const friend = await Friend.create({
    user: req.user._id,
    friend: userFriendDoc,
  })

  const data = res.success({ friend })
  req.io.sendTo('$friend/post', friendId, data)
}

export const removeFriend: UserController = async (req, res) => {
  const { friendId } = req.params
  checkType.string({ friend: friendId })

  const friend = await Friend.deleteOne({
    $or: [
      { user: req.user._id, friend: friendId },
      { friend: req.user._id, user: friendId },
    ],
  })
  if (!friend.deletedCount) {
    throw new ReqError('No friend found with this id')
  }

  res.status(204).end()
  req.io.sendTo('$friend/delete', friendId, getSuccess({ friend: friendId }))
}

export const acceptFriend: UserController = async (req, res) => {
  const { friendId } = req.params
  checkType.string({ friend: friendId })

  const friend = await Friend.findOne({
    user: friendId,
    friend: req.user._id,
    accepted: false,
  })
  if (!friend) throw new ReqError('No pending request found with this info')

  friend.accepted = true
  await friend.save()
  const populatedDoc = await friend.populate({
    path: 'user',
    select: userSafeInfo,
  })

  const data = res.success({ friend: populatedDoc })
  req.io.sendTo('$friend/accept', friendId, data)
}
