import mongoose, { HydratedDocument, Model, Types } from 'mongoose'
import { USER_PUBLIC_INFO } from '../config'

const groupUsersSchema = new mongoose.Schema<GroupUsersType>({
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

const schema = new mongoose.Schema<GroupType>(
  {
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    owner: {
      type: mongoose.Types.ObjectId as any,
      required: true,
      ref: 'user',
    },

    users: [groupUsersSchema],
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
  }
)

schema.post('remove', function () {
  // TODO: delete all the messages when group is deleted
  console.log(this)
})

export const POPULATE_GROUP = {
  path: 'owner users.user',
  select: USER_PUBLIC_INFO,
}

export default mongoose.model('group', schema) as Model<
  GroupType,
  {},
  GroupCustomMethods
>

interface GroupUsersType {
  accepted: boolean
  user: mongoose.Types.ObjectId
}

type UserDocumentProps = {
  users: Types.DocumentArray<GroupUsersType>
}

interface GroupType {
  _id: mongoose.Types.ObjectId
  name: string
  avatar: string
  owner: mongoose.Types.ObjectId
  users: GroupUsersType[]
}

type GroupCustomMethods = UserDocumentProps & {}

export type GroupDocument = HydratedDocument<GroupType, GroupCustomMethods>
