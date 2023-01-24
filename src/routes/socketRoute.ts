import { SocketRouter } from '../utils/socket'
const router = new SocketRouter()
export default router
import * as messageSocket from '../controller/message/messageSocket'

router.on('messages/get', messageSocket.getMessage)
router.on('messages/post', messageSocket.createMessage)
router.on('messages/patch', messageSocket.updateMessage)
router.on('messages/delete', messageSocket.deleteMessage)
router.on('test', messageSocket.test)
