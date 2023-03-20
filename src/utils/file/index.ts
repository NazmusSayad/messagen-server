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

export const uploadBASE64Files = (files: string[]) => {
  const promises = files.map((base64) => {
    const match = base64.match(regex)
    const ext = match && match[1]?.toLowerCase()
    if (!ci.allowed_formats.includes(ext)) throw new ReqError('Invalid image')

    const base64Data = base64.replace(regex, '')
    const fileName = createTempObjectId() + '.' + ext
    return writeFile(fileName, base64Data, 'base64')
  })

  return Promise.all(promises)
}
