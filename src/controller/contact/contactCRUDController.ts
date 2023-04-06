import { checkType } from 'express-master'
import Contact, { ContactDocument, POPULATE_CONTACT } from '../../model/Contact'
import User from '../../model/User'
import { UserController } from '../types'
import { getAddedUser, getRoomsFromContact, isContactOwner } from './utils'

export type GroupController = UserController<{
  $contact: ContactDocument
}>

export const setContact: GroupController = async (req, res, next) => {
  const { contactId } = req.params
  checkType.string({ contactId })

  const group = await Contact.findById(contactId)
  if (!group) throw new ReqError('No group found')

  req.$contact = group
  next()
}

export const saveAndSendContact: GroupController = async (req, res) => {
  const contact = await req.$contact.save()
  const data = res.success({
    contact: await contact.populate(POPULATE_CONTACT),
  })

  req.io.sendTo('contact/put', getRoomsFromContact(contact), data)
}

export const getContacts: UserController = async (req, res, next) => {
  const usersQuery = { users: { $elemMatch: { user: req.user._id } } }
  const contacts = await Contact.find({
    $or: [{ owner: req.user._id }, usersQuery],
  }).populate(POPULATE_CONTACT)

  res.success({ contacts })
}

export const createContact: GroupController = async (req, res, next) => {
  const { name, avatar, user } = req.body

  if (user) {
    checkType.string({ user })
    await User.checkUserExists(user)
    await Contact.checkContactNotExists(user, req.user._id)

    req.$contact = new Contact({ owner: req.user._id, users: [{ user }] })
  } else {
    checkType.string({ name })
    checkType.optional.string({ avatar })
    req.$contact = new Contact({ name, avatar, owner: req.user._id })
  }

  next()
}

export const updateContact: GroupController = async (req, res, next) => {
  const { name, avatar } = req.body
  checkType.string({ name })
  checkType.optional.string({ avatar })

  req.$contact.set({ name, avatar })
  next()
}

export const deleteContact: GroupController = async (req, res) => {
  const isOwner = isContactOwner(req)

  if (!req.$contact.name || isOwner) {
    await req.$contact.remove()
    res.status(204).end()
    return req.io.sendTo(
      'contact/delete',
      getRoomsFromContact(req.$contact),
      req.$contact._id
    )
  }

  // FIXME: These are maybe buggy!

  getAddedUser(req.$contact.users, req.user._id).remove()
  await req.$contact.save()
  res.status(204).end()

  req.io.send('contact/delete', req.$contact._id)
  req.io.sendTo(
    'contact/put',
    getRoomsFromContact(req.$contact),
    req.$contact._id
  )
}
