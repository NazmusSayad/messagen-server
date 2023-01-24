import { SocketController } from '../../utils/socket'

export const getMessage: SocketController = async (info) => {}

export const createMessage: SocketController = async (info) => {}

export const updateMessage: SocketController = async (info) => {}

export const deleteMessage: SocketController = async (info) => {}

export const test: SocketController = (info) => {
  info.send({ hello: 'world', info: info.data })
  info.sendTo([], { hello: 'world', info: info.data })
}
