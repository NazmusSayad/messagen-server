import mongoose from 'mongoose'

export interface UserType {
  _id: string
  name: string
  username: string
  email: string
  avatar: string
  password: string
  passwordModifiedAt: Date
  createdAt: Date
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
    email: {
      type: String,
      lowercase: true,
      trim: true as any,
      unique: [true, 'Username already exists'],
      required: [true, 'User must have a username'],
      // @ts-ignore
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },
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
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
  }
)
