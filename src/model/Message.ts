import mongoose, { HydratedDocument, Model } from 'mongoose'

const schema = new mongoose.Schema<MessageType>(
  {
    from: {
      type: mongoose.Types.ObjectId as any,
      required: true,
      populate: true,
      ref: 'user',
    },
    to: {
      type: mongoose.Types.ObjectId as any,
      required: true,
      select: false,
    },

    text: {
      type: String,
      maxlength: 300,
      trim: true,
    },
    images: [String],
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
}

interface MessageCustomMethods {}

export type MessageDocument = HydratedDocument<
  MessageType,
  MessageCustomMethods
>
