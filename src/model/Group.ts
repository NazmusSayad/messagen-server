import mongoose, { HydratedDocument, Model } from 'mongoose'

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
    },

    users: [mongoose.Types.ObjectId],
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

export default mongoose.model('group', schema) as Model<
  GroupType,
  {},
  GroupCustomMethods
>

interface GroupType {
  _id: mongoose.Types.ObjectId
  name: string
  avatar: string
  owner: mongoose.Types.ObjectId
  users: mongoose.Types.ObjectId[]
}

interface GroupCustomMethods {}

export type GroupDocument = HydratedDocument<GroupType, GroupCustomMethods>
