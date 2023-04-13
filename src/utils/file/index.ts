import path from 'path'
import { WriteFileOptions, writeFileSync } from 'fs'
import { createTempObjectId } from '..'
import * as ci from './ci'
import { UploadApiOptions } from 'cloudinary'
const regex = /^data:image\/(\w+);base64,/

type WriteFile = (
  fileName: string,
  data: string | NodeJS.ArrayBufferView,
  options?: WriteFileOptions
) => string

const writeFile: WriteFile = (fileName, ...args) => {
  const filePath = path.join(ci.tempFolder, '/', fileName)
  writeFileSync(filePath, ...args)
  return filePath
}

const uploadBASE64Files = (
  files: string[],
  options = {} as UploadApiOptions
) => {
  const promises = files.map((base64) => {
    const sizeInBytes = 4 * Math.ceil(base64.length / 3) * 0.5624896334383812
    if (sizeInBytes / 1000 > 3072) {
      throw new ReqError('File is too largey')
    }

    const match = base64.match(regex)
    const ext = match && match[1]?.toLowerCase()
    if (!ci.allowed_formats.includes(ext)) throw new ReqError('Invalid image')

    const base64Data = base64.replace(regex, '')
    const fileName = createTempObjectId() + '.' + ext
    const filePath = writeFile(fileName, base64Data, 'base64')
    return ci.save(filePath, options)
  })

  return Promise.all(promises)
}

export const uploadLocalMessage = (files: Express.Multer.File[]) => {
  const promises = files.map((file) => {
    return ci.save(file.path, {
      transformation: [{ width: 1920, height: 1920, crop: 'limit' }],
    })
  })

  return Promise.all(promises)
}

export const uploadBase64Message = (files: string[]) => {
  return uploadBASE64Files(files, {
    transformation: [{ width: 1920, height: 1920, crop: 'limit' }],
  })
}
