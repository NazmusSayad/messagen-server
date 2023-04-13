import { getRoomsFromContact } from '../contact/utils'
import { UserController } from '../types'
import * as msg from './message'

export const createMessage: UserController = async (req, res) => {
  const [message, contact] = await msg.create({
    user: req.user,
    body: { ...req.body, images: req.files },
  })
  const data = res.success({ message })
  req.io.sendTo('messages/post', getRoomsFromContact(contact), data)
}
