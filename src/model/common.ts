export const email = {
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
}
