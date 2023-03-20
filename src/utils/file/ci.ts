import fs from 'fs'
import path from 'path'
import cloudinaryMain from 'cloudinary'

cloudinaryMain.v2.config()
export const tempFolder = path.join(__dirname, './.cache')
const { upload, destroy } = cloudinaryMain.v2.uploader
export const allowed_formats = ['png', 'jpg', 'webp', 'jpeg', 'svg']
fs.existsSync(tempFolder) || fs.mkdirSync(tempFolder, { recursive: true })

const cloudinaryOptions = {
  folder: 'messagen',
  allowed_formats,
  unique_filename: true,
  resource_type: 'image',
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

export const save = async (filePath) => {
  try {
    const data = await upload(filePath, cloudinaryOptions as any)
    fs.rmSync(filePath)
    return data.secure_url ?? data.url
  } catch (err) {
    fs.rmSync(filePath, { force: true })
    throw err
  }
}

export const remove = async (url) => {
  if (!url) return
  const publicId = url.match(/(\w*\/\w*)\.\w*$/)[1]
  await destroy(publicId)
}
