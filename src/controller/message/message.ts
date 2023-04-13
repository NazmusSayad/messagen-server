import { checkType } from 'express-master'
import Contact, { ContactDocument } from '../../model/Contact'
import Message, { MessageDocument } from '../../model/Message'
import { UserDocument } from '../../model/User'
import { uploadBase64Message, uploadLocalMessage } from '../../utils/file'

type Create = (
  props: {
    user: UserDocument
    body
  },
  isBase64: boolean
) => Promise<[MessageDocument, ContactDocument]>
export const create: Create = async ({ user, body }, isBase64) => {
  const { to, text, images } = body
  checkType.string({ to })
  checkType.optional.string({ text })
  if (!text && !images) throw new ReqError('Message must not be empty')

  const contact = await Contact.getContact(user._id, to)
  const message = new Message({ text, from: user, to: contact._id })

  message.images = await (isBase64 ? uploadBase64Message : uploadLocalMessage)(
    images
  )
  await message.save()

  return [message, contact]
}
