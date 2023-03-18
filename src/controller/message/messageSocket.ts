import { checkType } from 'express-master'
import Contact from '../../model/Contact'
import Message from '../../model/Message'
import { SocketController } from '../../utils/socket'
import { getRoomsFromContact } from '../contact/utils'

export const getMessage: SocketController = async (info) => {
  const messages = await Message
}

export const createMessage: SocketController = async (info) => {
  const { to, text, images } = info.data
  checkType.string({ to })
  checkType.optional.string({ text })
  if (!text && !images) throw new ReqError('Message must not be empty')

  const contact = await Contact.getContact(info.user._id, to)
  const message = await Message.create({
    from: info.user,
    to,
    text,
    images,
  })

  info.sendTo(getRoomsFromContact(contact), { message })
}

export const deleteMessage: SocketController = async (info) => {
  const message = await Message
}
