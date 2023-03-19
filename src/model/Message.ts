import mongoose, { HydratedDocument, Model } from 'mongoose'
import { createdAtField } from './utils'

const schema = new mongoose.Schema<MessageType>(
  {
    from: {
      type: mongoose.Types.ObjectId as any,
      required: true,
      ref: 'user',
    },
    to: {
      type: mongoose.Types.ObjectId as any,
      required: true,
    },

    images: [String],
    text: {
      type: String,
      maxlength: 300,
      trim: true,
    },

    createdAt: createdAtField(),
  },
  {
    versionKey: false,
  }
)

export default mongoose.model('message', schema) as Model<
  MessageType,
  {},
  MessageCustomMethods
>

interface MessageType {
  _id: mongoose.Types.ObjectId
  from: mongoose.Types.ObjectId
  to: mongoose.Types.ObjectId
  text: string
  images: string[]
  createdAt: Date
}

interface MessageCustomMethods {}

export type MessageDocument = HydratedDocument<
  MessageType,
  MessageCustomMethods
>
