import mongoose from 'mongoose'

export interface FriendType {
  _id: mongoose.Types.ObjectId
  user: mongoose.Types.ObjectId
  friend: mongoose.Types.ObjectId
  accepted: boolean
}

const schema = new mongoose.Schema<FriendType>(
  {
    user: {
      type: mongoose.Types.ObjectId as any,
      required: true,
    },
    friend: {
      type: mongoose.Types.ObjectId as any,
      required: true,
    },
    accepted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
  }
)

export default mongoose.model('friend', schema)
