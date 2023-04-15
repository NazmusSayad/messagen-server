import { UserDocument } from '../../model/User'
import { uploadAvatar } from '../../utils/file'
import * as ci from '../../utils/file/ci'

export const updateAvatarAndSave = async (
  user: UserDocument,
  file: Express.Multer.File
) => {
  if (file) {
    await user.validate()
    user.avatar && (await ci.remove(user.avatar))
    user.avatar = await uploadAvatar(file)
  }

  await user.save()
}
