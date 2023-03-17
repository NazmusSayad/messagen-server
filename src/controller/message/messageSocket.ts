import { checkType } from 'express-master'
import Contact from '../../model/Contact'
import Message from '../../model/Message'
import { SocketController } from '../../utils/socket'

export const getMessage: SocketController = async (info) => {
  const messages = await Message
}

export const createMessage: SocketController = async (info) => {
  const { to, text, images } = info.data
  checkType.string({ to })
  if (!text && !images) {
    throw new ReqError('Message must not be empty')
  }

  const isExists = await Contact.findById(to)
  if (!isExists) throw new ReqError('Contact does not exists')

  const message = await Message.create({
    from: info.user,
    to,
    text,
    images,
  })

  info.send({ message })
}

export const deleteMessage: SocketController = async (info) => {
  const message = await Message
}
