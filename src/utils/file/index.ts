import path from 'path'
import { WriteFileOptions, writeFileSync } from 'fs'
import { createTempObjectId } from '..'
import * as ci from './ci'
const regex = /^data:image\/(\w+);base64,/

type WriteFile = (
  fileName: string,
  data: string | NodeJS.ArrayBufferView,
  options?: WriteFileOptions
) => Promise<string>

const writeFile: WriteFile = (fileName, ...args) => {
  const filePath = path.join(ci.tempFolder, '/', fileName)
  writeFileSync(filePath, ...args)
  return ci.save(filePath)
}

const getBASE64SizeInKb = (base64: string) => {
  const sizeInBytes = 4 * Math.ceil(base64.length / 3) * 0.5624896334383812
  return sizeInBytes / 1000
}

export const uploadBASE64Files = (files: string[]) => {
  const promises = files.map((base64) => {
    if (getBASE64SizeInKb(base64) > 2048) {
      throw new ReqError('File is too largey')
    }

    const match = base64.match(regex)
    const ext = match && match[1]?.toLowerCase()
    if (!ci.allowed_formats.includes(ext)) throw new ReqError('Invalid image')

    const base64Data = base64.replace(regex, '')
    const fileName = createTempObjectId() + '.' + ext
    return writeFile(fileName, base64Data, 'base64')
  })

  return Promise.all(promises)
}
