import mongoose, { HydratedDocument, Model } from 'mongoose'

const schema = new mongoose.Schema<MessageType>(
  {
    group: {
      type: Boolean,
      select: false,
      default: false,
    },
    from: {
      type: mongoose.Types.ObjectId as any,
      required: true,
    },
    to: {
      type: mongoose.Types.ObjectId as any,
      required: true,
    },
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
  }
)

export default mongoose.model('message', schema) as Model<
  MessageType,
  {},
  MessageCustomMethods
>

interface MessageType {
  _id: mongoose.Types.ObjectId
  group?: boolean
  from: mongoose.Types.ObjectId
  to: mongoose.Types.ObjectId
}

interface MessageCustomMethods {}

export type MessageDocument = HydratedDocument<
  MessageType,
  MessageCustomMethods
>
