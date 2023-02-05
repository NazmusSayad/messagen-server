import Message from '../../model/Message'
import { SocketController } from '../../utils/socket'

export const getMessage: SocketController = async (info) => {
  const messages = await Message
}

export const createMessage: SocketController = async (info) => {
  const message = await Message
}

export const updateMessage: SocketController = async (info) => {
  const message = await Message
}

export const deleteMessage: SocketController = async (info) => {
  const message = await Message
}
