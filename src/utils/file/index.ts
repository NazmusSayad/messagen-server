import path from 'path'
import { WriteFileOptions, writeFileSync } from 'fs'
import * as ci from './ci'

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

export const uploadLocalMessage = (files: Express.Multer.File[]) => {
  const promises = files.map((file) => {
    return ci.save(file.path, {
      transformation: [{ width: 1920, height: 1920, crop: 'limit' }],
    })
  })

  return Promise.all(promises)
}
