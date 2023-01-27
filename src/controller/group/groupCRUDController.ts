import { checkType } from 'express-master'
import Group, { GroupDocument } from '../../model/Group'
import { UserController } from '../types'

export type GroupController = UserController<{
  $group: GroupDocument
}>

export const getGroups: UserController = async (req, res, next) => {}

export const createGroup: UserController = async (req, res) => {
  const reqBody = req.getBody('name', 'avatar')
  checkType.string(reqBody)
  const group = await Group.create({ ...reqBody, owner: req.user })
  res.success({ group })
}

export const updateGroup: GroupController = async (req, res) => {
  const reqBody = req.getBody('name', 'avatar')
  checkType.string(reqBody)
  req.$group.set(reqBody)
  const group = await req.$group.save()
  res.success({ group })
}

export const deleteGroup: GroupController = async (req, res) => {
  await req.$group.remove()
  res.status(204).end()
}
