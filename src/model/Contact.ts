import mongoose, { HydratedDocument, Model, Types } from 'mongoose'
import { USER_PUBLIC_INFO } from '../config'

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
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
  }
)

schema.pre('save', function () {
  const ownerId = this.owner.toString()
  const userIds = this.users.map(({ user }) => user.toString())
  console.log(userIds, ownerId)

  if (userIds.includes(ownerId)) {
    throw new ReqError('Owner cannot be present with users')
  }

  if (new Set(userIds).size !== userIds.length) {
    throw new ReqError('User is already in this contact')
  }
})

schema.post('remove', function () {
  // TODO: delete all the messages when group is deleted
  console.log(this)
})

schema.statics.checkUserNotExists = function (user1, user2) {
  const Contact = this
  user1 = user1.toString()
  user2 = user2.toString()

  return new Promise(async (res, rej) => {
    try {
      type T = Parameters<typeof Contact.findOne>[0]
      const filter: T = {
        $or: [
          { owner: user1, users: { $elemMatch: { user: user2 } } },
          { owner: user2, users: { $elemMatch: { user: user1 } } },
        ],
      }

      const user = await Contact.findOne(filter)
      if (user) throw new ReqError('Contact already exists')
      res(true)
    } catch (err) {
      rej(err)
    }
  })
}

export const POPULATE_CONTACT = {
  path: 'owner users.user',
  select: USER_PUBLIC_INFO,
}

export default mongoose.model('contact', schema) as ContactModel
interface ContactModel extends Model<ContactType, {}, ContactCustomMethods> {
  checkUserNotExists(user1, user2): void
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
}

type ContactCustomMethods = UserDocumentProps & {}

export type ContactDocument = HydratedDocument<
  ContactType,
  ContactCustomMethods
>
