import { NextFunction, Request, Response } from 'express'
import { UserDocument } from '../model/User'
import { mainIo } from '../socket'

export interface UserRequest extends Request {
  user: UserDocument
  io: {
    send: typeof mainIo.emit
    sendTo(ev: string, rooms: string | [string], data: unknown): void
    disconnect: typeof mainIo.disconnectSockets
  }
}

export interface UserController<T = {}> {
  (req: UserRequest & T, res: Response, next: NextFunction): void
}
