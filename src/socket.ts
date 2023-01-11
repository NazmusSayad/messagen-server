import { Server } from 'socket.io'
import { onConnect } from './controller/auth/socketController'

const root = new Server({ cors: { origin: '*' } })
const verifiedIo = root.of('/')

verifiedIo.on('connection', onConnect)

export default root
export { verifiedIo }
