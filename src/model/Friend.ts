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
      populate: true,
      ref: 'user',
    },
    friend: {
      type: mongoose.Types.ObjectId as any,
      required: true,
      populate: true,
      ref: 'user',
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

schema.index({ user: 1, friend: 1 }, { unique: true })
export default mongoose.model('friend', schema)
