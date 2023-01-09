// @ts-nocheck
import mongoose, { HydratedDocument, Model } from 'mongoose'
import * as bcrypt from 'bcrypt'
import userSchema, { UserType } from './userSchema'
import mail from '../utils/mail'
import { getFieldsFromObject } from '../utils'

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(
      this.password,
      +process.env.BCRYPT_SALT_ROUND
    )

    this.passwordModifiedAt = Date.now()
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

userSchema.methods.getSafeInfo = function () {
  return getFieldsFromObject(
    this,
    '_id',
    'name',
    'username',
    'email',
    'verified',
    'avatar'
  )
}

export default mongoose.model('user', userSchema) as Model<
  UserType,
  {},
  UserCustomMethods
>
interface UserCustomMethods {
  getSafeInfo(): any
}

export type UserDocument = HydratedDocument<UserType, UserCustomMethods>
