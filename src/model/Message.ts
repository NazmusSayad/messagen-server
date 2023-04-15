import mongoose, { HydratedDocument, Model } from 'mongoose'
import * as file from '../utils/file/ci'
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
      maxlength: 1000,
      trim: true,
    },

    createdAt: createdAtField(),
  },
  {
    versionKey: false,
  }
)

schema.post('remove', async function ({ images }: MessageDocument) {
  await Promise.all(images.map(file.remove)).catch(() => {})
})

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
