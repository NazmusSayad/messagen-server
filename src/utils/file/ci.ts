import fs from 'fs'
import path from 'path'
import cloudinaryMain from 'cloudinary'
const { upload, destroy } = cloudinaryMain.v2.uploader
const tempDir = path.join(__dirname, './.temp')

cloudinaryMain.v2.config({
  cloud_name: process.env.C_CLOUD_NAME,
  api_key: process.env.C_API_KEY,
  api_secret: process.env.C_API_SECRET,
})

const cloudinaryOptions = {
  unique_filename: true,
  folder: 'avatar',
  resource_type: 'image',
  allowed_formats: ['png', 'jpg', 'webp', 'jpeg', 'svg'],
  transformation: [
    {
      width: 512,
      height: 512,
      gravity: 'auto',
      crop: 'fill',
    },
    {
      fetch_format: 'webp',
    },
  ],
}

export const save = async ({ originalname, path: oldPath }) => {
  const filePath = oldPath + '-' + originalname.replace(/ /gim, '-')
  fs.renameSync(oldPath, filePath)

  const data = await upload(filePath, cloudinaryOptions as any)
  fs.rmSync(filePath)

  return data.secure_url ?? data.url
}

export const remove = async (url) => {
  if (!url) return
  const publicId = url.match(/(avatar\/\w*)(\.\w*)$/)[1]
  await destroy(publicId)
}

export const updateFile = async ({ file }, user) => {
  if (!file) return
  const newUrl = await save(file)
  if (user.avatar) await remove(user.avatar)
  user.avatar = newUrl
}

/* export const fileMiddleware = require('multer')({
  dest: tempDir,
  limits: {
    fileSize: 2_500_000,
  },
}).single('avatar') */
