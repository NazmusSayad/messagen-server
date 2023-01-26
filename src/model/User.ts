// @ts-nocheck
import mongoose, { HydratedDocument, Model } from 'mongoose'
import * as bcrypt from 'bcrypt'
import userSchema, { UserType } from './userSchema'
import mail from '../utils/mail'
import { getFieldsFromObject } from '../utils'
import Friend from './Friend'
import Message from './Message'
import Group from './Group'

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(
      this.password,
      +process.env.BCRYPT_SALT_ROUND
    )

    if (!this.isNew) {
      this.passwordModifiedAt = Math.round(Date.now() / 1000) * 1000
    }
  }

  if (this.verificationCode && this.isModified('verificationCode')) {
    this._verificationCode = this.verificationCode

    this.verificationCode = await bcrypt.hash(
      this.verificationCode,
      +process.env.BCRYPT_SALT_ROUND_2
    )
  }

  if (this.recoverCode && this.isModified('recoverCode')) {
    this._recoverCode = this.recoverCode

    this.recoverCode = await bcrypt.hash(
      this.recoverCode,
      +process.env.BCRYPT_SALT_ROUND_2
    )
  }

  next()
})

userSchema.post('save', function () {
  if (this._verificationCode) {
    mail({
      to: this.email,
      subject: 'Account verificaiton code',
      body: this._verificationCode,
    })
  }

  if (this._recoverCode) {
    mail({
      to: this.email,
      subject: 'Password Reset Code',
      body: this._recoverCode,
    })
  }
})

userSchema.post('remove', function (this: UserDocument) {
  ;(async () => {
    const [friends, groups] = await Promise.all([
      Friend.find({ $or: [{ user: this._id }, { friend: this._id }] }),
      Group.find({ users: { $elemMatch: this._id } }),
    ])

    console.log(friends, groups)

    for (let friend of friends) {
      await Promise.all([Message.deleteMany({ to: friend._id })])
      await friend.delete()
    }
  })().catch(() => {})
})

userSchema.methods.getSafeInfo = function () {
  return getFieldsFromObject(this, ...userSafeInfo.split(' '))
}

export const userSafeInfo = '_id name username email isVerified avatar'

export default mongoose.model('user', userSchema) as Model<
  UserType,
  {},
  UserCustomMethods
>

interface UserCustomMethods {
  getSafeInfo(): UserType
}

export type UserDocument = HydratedDocument<UserType, UserCustomMethods>
