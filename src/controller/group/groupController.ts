import { checkType } from 'express-master'
import Group from '../../model/Group'
import { GroupController } from './groupCRUDController'

export const setGroup: GroupController = async (req, res, next) => {
  const { groupId } = req.params
  checkType.string({ groupId })

  const group = await Group.findById(groupId)
  if (!group) throw new ReqError('No group found')

  req.$group = group
  next()
}

export const checkIfUserIsOwner: GroupController = (req, res, next) => {
  if (req.$group.owner.toString() !== req.user._id.toString()) {
    throw new ReqError('You need to be the owner for this action')
  }
  next()
}

export const inviteUser: GroupController = async (req, res, next) => {}

export const removeUser: GroupController = async (req, res, next) => {}

export const acceptInvitation: GroupController = async (req, res, next) => {}
