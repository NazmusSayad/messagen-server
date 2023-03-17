import Contact from '../../model/Contact'
import Message from '../../model/Message'
import { SocketController } from '../../utils/socket'

export const getMessage: SocketController = async (info) => {
  const messages = await Message
}

export const createMessage: SocketController = async (info) => {
  const { friend, group, text, images } = info.data
  if ((friend && group) || (!text && !images)) {
    throw new ReqError('heljasdkf kalsjdfkas dfkjasf')
  }

  let col
  if (friend) {
    const isOk = await Contact.findById(friend)
    if (isOk) col = { friend }
  } else if (group) {
    const isOk = await Contact.findById(group)
    if (isOk) col = { group }
  } else {
    throw new ReqError('NOthing found!')
  }

  const message = await Message.create({
    ...col,
    from: info.user,
    text,
    images,
  })

  info.send({ message })
}

export const deleteMessage: SocketController = async (info) => {
  const message = await Message
}
