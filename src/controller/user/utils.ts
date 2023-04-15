import { Request } from 'express'
import { UserDocument } from '../../model/User'
import { uploadAvatar } from '../../utils/file'
import * as ci from '../../utils/file/ci'

export const updateAvatarFromReq = async (user: UserDocument, req: Request) => {
  if (req.file) {
    await user.validate()
    user.avatar && (await ci.remove(user.avatar))
    user.avatar = await uploadAvatar(req.file)
  }

  await user.save()
}
