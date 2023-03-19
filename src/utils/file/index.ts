import path from 'path'
import { existsSync, mkdirSync, WriteFileOptions, writeFileSync } from 'fs'
import { createTempObjectId } from '..'
const allowedList = ['jpg', 'jpeg', 'png', 'webp']

const tempFolder = path.join(__dirname, './.cache')
existsSync(tempFolder) || mkdirSync(tempFolder, { recursive: true })

const writeFile = (
  fileName: string,
  ...args: [string | NodeJS.ArrayBufferView, WriteFileOptions?]
) => {
  const filePath = path.join(tempFolder, '/', fileName)
  writeFileSync(filePath, ...args)
  return filePath
}

export const uploadBASE64Files = (files: string[]) => {
  return files.map((file) => {
    const match = file.match(/^data:image\/(\w+);base64,/)
    const ext = match && match[1]?.toLowerCase()
    if (!allowedList.includes(ext)) throw new ReqError('Invalid image')

    const base64Data = file.replace(/^data:image\/png;base64,/, '')
    const fileName = createTempObjectId() + '.' + ext
    return writeFile(fileName, base64Data, 'base64')
  })
}
