import { checkType } from 'express-master'
import Contact from '../../model/Contact'
import Message from '../../model/Message'
import { SocketController } from '../../utils/socket'
import { getRoomsFromContact } from '../contact/utils'
import { USER_PUBLIC_INFO } from '../../config'
import * as msg from './message'

export const getMessage: SocketController = async (info) => {
  const messages = await Message
}

export const getMessagesOlderThan: SocketController = async (info) => {
  checkType.string(info.data)
  const contact = await Contact.getContact(info.user._id, info.data.to)
  const messages = await Message.find({ to: contact._id }).populate({
    path: 'from',
    select: USER_PUBLIC_INFO,
  })

  info.send({ messages })
}

export const createMessage: SocketController = async (info) => {
  const [message, contact] = await msg.create(
    { user: info.user, body: info.data },
    true
  )
  info.sendTo(getRoomsFromContact(contact), { message })
}

export const deleteMessage: SocketController = async (info) => {
  const _id = info.data
  checkType.string({ _id })

  const message = await Message.findOne({ _id, from: info.user._id })
  if (!message) throw new ReqError('No message found')

  const contact = await Contact.findById(message.to)
  await message.delete()

  info.sendTo(getRoomsFromContact(contact), _id)
}
