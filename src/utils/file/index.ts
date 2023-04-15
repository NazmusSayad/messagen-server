import * as ci from './ci'

export const uploadLocalMessage = (files: Express.Multer.File[]) => {
  const promises = files.map((file) => {
    return ci.save(file.path, {
      folder: 'messagen/messages',
      transformation: [{ width: 1920, height: 1920, crop: 'limit' }],
    })
  })

  return Promise.all(promises)
}

export const uploadAvatar = (file: Express.Multer.File) => {
  return ci.save(file.path, {
    folder: 'messagen/avatar',
    transformation: [
      { width: 512, height: 512, gravity: 'auto', crop: 'fill' },
    ],
  })
}
