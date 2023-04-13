import { checkType } from 'express-master'
import Contact, { ContactDocument } from '../../model/Contact'
import Message, { MessageDocument } from '../../model/Message'
import { UserDocument } from '../../model/User'
import { uploadLocalMessage } from '../../utils/file'

type Create = (props: {
  user: UserDocument
  body
}) => Promise<[MessageDocument, ContactDocument]>
export const create: Create = async ({ user, body }) => {
  const { to, text, images } = body
  checkType.string({ to })
  checkType.optional.string({ text })
  if (!text && !images) throw new ReqError('Message must not be empty')

  const contact = await Contact.getContact(user._id, to)
  const message = new Message({ text, from: user, to: contact._id })
  if (images) {
    message.images = await uploadLocalMessage(images)
  }

  await message.save()
  return [message, contact]
}
