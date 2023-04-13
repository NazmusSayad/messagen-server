import multer from 'multer'
import { tempFolder } from './ci'

export default (limit = 2_500_000) => {
  return multer({
    dest: tempFolder,
    limits: { fileSize: limit },
  })
}
