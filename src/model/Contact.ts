import mongoose, { HydratedDocument, Model, Types } from 'mongoose'
import { USER_PUBLIC_INFO } from '../config'
import { getRoomsFromContact } from '../controller/contact/utils'
import { mainIo } from '../socket'
import Message from './Message'
import {
  createdAtField,
  getAcceptedFriendsQuery,
  getAcceptedGroupsQuery,
  getFriendsQuery,
  getGroupsQuery,
} from './utils'

const contactUsersSchema = new mongoose.Schema<ContactUsersType>({
  user: {
    type: mongoose.Types.ObjectId as any,
    required: true,
    ref: 'user',
  },
  accepted: {
    type: Boolean,
    default: false,
    required: true,
  },
})

const schema = new mongoose.Schema<ContactType>(
  {
    name: {
      type: String,
    },
    avatar: {
      type: String,
    },

    owner: {
      type: mongoose.Types.ObjectId as any,
      required: true,
      ref: 'user',
    },

    users: [contactUsersSchema],
    createdAt: createdAtField(),
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
  }
)

schema.pre('save', function () {
  const ownerId = this.owner.toString()
  const userIds = this.users.map(({ user }) => user.toString())

  if (userIds.includes(ownerId)) {
    throw new ReqError('Owner cannot be present with users')
  }

  if (new Set(userIds).size !== userIds.length) {
    throw new ReqError('User is already in this contact')
  }
})

schema.post('remove', async function (contact: ContactDocument) {
  const messages = await Message.find({ to: contact._id }).select('')
  mainIo.to(getRoomsFromContact(contact)).emit('contact/delete', contact._id)
  Promise.all(messages.map((msg) => msg.remove())).catch(() => {})
})

schema.statics.getContactsByUser = async function (userId: string) {
  userId = userId.toString()
  type T = Parameters<typeof this.findOne>[0]

  const friendFilter: T = getFriendsQuery(userId)
  const groupFilter: T = getGroupsQuery(userId)

  return await this.find({ $or: [friendFilter, groupFilter] })
}

schema.statics.getContact = async function (userId: string, _id: string) {
  _id = _id.toString()
  userId = userId.toString()
  type T = Parameters<typeof this.findOne>[0]

  const friendFilter: T = { _id, ...getAcceptedFriendsQuery(userId, true) }
  const groupFilter: T = { _id, ...getAcceptedGroupsQuery(userId, true) }

  const contact = await this.findOne({ $or: [friendFilter, groupFilter] })
  if (!contact) throw new ReqError('Recipient does not exist or invalid')
  return contact
}

schema.statics.checkContactNotExists = async function (user1, user2) {
  const Contact = this
  user1 = user1.toString()
  user2 = user2.toString()

  type T = Parameters<typeof Contact.findOne>[0]
  const filter: T = {
    $or: [
      {
        owner: user1,
        users: { $elemMatch: { user: user2 } },
        name: { $exists: false },
      },
      {
        owner: user2,
        users: { $elemMatch: { user: user1 } },
        name: { $exists: false },
      },
    ],
  }

  const user = await Contact.findOne(filter)
  if (user) throw new ReqError('Contact already exists')
}

export const POPULATE_CONTACT = {
  path: 'owner users.user',
  select: USER_PUBLIC_INFO,
}

export default mongoose.model('contact', schema) as ContactModel
interface ContactModel extends Model<ContactType, {}, ContactCustomMethods> {
  checkContactNotExists(
    user1: Types.ObjectId,
    user2: Types.ObjectId
  ): Promise<void>

  getContactsByUser(userId: string | Types.ObjectId): Promise<ContactDocument[]>

  getContact(
    userId: string | Types.ObjectId,
    id: string | Types.ObjectId
  ): Promise<ContactDocument>
}

interface ContactUsersType {
  accepted: boolean
  user: mongoose.Types.ObjectId
}

type UserDocumentProps = {
  users: Types.DocumentArray<ContactUsersType>
}

interface ContactType {
  _id: mongoose.Types.ObjectId
  name: string
  avatar: string
  owner: mongoose.Types.ObjectId
  users: ContactUsersType[]
  createdAt: Date
}

type ContactCustomMethods = UserDocumentProps & {}

export type ContactDocument = HydratedDocument<
  ContactType,
  ContactCustomMethods
>
