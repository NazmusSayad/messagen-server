// @ts-nocheck
import mongoose, { HydratedDocument, Model } from 'mongoose'
import * as bcrypt from 'bcrypt'
import userSchema, { UserType } from './userSchema'
import mail from '../utils/mail'
import { getFieldsFromObject } from '../utils'
import Friend from './Friend'
import Message from './Message'
import Group from './Contact'
import { USER_SAFE_INFO } from '../config'

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
  // TODO:
})

userSchema.methods.getSafeInfo = function () {
  return getFieldsFromObject(this, ...USER_SAFE_INFO.split(' '))
}

userSchema.statics.checkUserExists = function (id, getUser = false) {
  const User = this
  return new Promise(async (res, rej) => {
    try {
      const query = User.findById(id)
      const user = await (getUser ? query : query)

      if (!user) throw new ReqError('No user found with this information')
      res(user)
    } catch (err) {
      rej(err)
    }
  })
}

export default mongoose.model('user', userSchema) as UserModel
interface UserModel extends Model<UserType, {}, UserCustomMethods> {
  checkUserExists(id: string, getUser?: boolean): Promise<UserDocument>
}

interface UserCustomMethods {
  getSafeInfo(): UserType
}

export type UserDocument = HydratedDocument<UserType, UserCustomMethods>
