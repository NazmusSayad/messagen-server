import mongoose, { Model } from 'mongoose'
import * as common from './common'

export interface UserType {
  _id: string
  name: string
  username: string
  email: string
  avatar: string
  password: string
  passwordModifiedAt: Date
  createdAt: Date
  verified: boolean
  recoverCode: string
  verificationCode: string
}

export default new mongoose.Schema<UserType>(
  {
    name: {
      type: String,
      required: [true, 'User must have a name'],
      match: [/^[a-zA-Z]{1,}(?: [a-zA-Z]+){0,2}$/, 'Enter a valid name.'],
    },
    username: {
      type: String,
      lowercase: true,
      trim: true as any,
      unique: [true, 'Username already exists'],
      required: [true, 'User must have a username'],
      // @ts-ignore
      match: [/^[a-z0-9]+$/, 'Enter a valid username.'],
    },
    email: common.email as any,
    avatar: {
      type: String,
      match: [/^https?:\/\//, 'Please enter a valid image url'],
    },
    password: {
      type: String,
      required: [true, 'User must have a password'],
    },
    passwordModifiedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    verified: {
      type: Boolean,
      default: false,
      required: true,
    },

    recoverCode: { type: String },
    verificationCode: { type: String },
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
  }
)
