import { SocketRouter } from '../utils/socket'
const router = new SocketRouter()
export default router
import * as messageSocket from '../controller/message/messageSocket'

router.on('messages/get', messageSocket.getMessage)
router.on('messages/get-older', messageSocket.getMessagesOlderThan)
router.on('messages/post', messageSocket.createMessage)
router.on('messages/delete', messageSocket.deleteMessage)
