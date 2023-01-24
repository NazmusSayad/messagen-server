import { getErrorInfo } from 'req-error'
import { Namespace, Socket } from 'socket.io'
import { UserType } from '../model/userSchema'

export interface SocketController {
  (info: {
    io: Namespace
    socket: Socket
    user: UserType
    event: string
    data: any
    send: <T extends any>(data: T) => { status: 'success'; data: T }
  }): void | Promise<void>
}

export class SocketRouter {
  #io: Namespace
  #listners: { [ev: string]: SocketController } = {}

  on(ev, cb) {
    this.#listners[ev] = cb
  }

  setup(io: Namespace) {
    this.#io = io
  }

  async runSocket(socket: Socket, user: UserType, ev: string, data, resolve) {
    const callback = this.#listners[ev]
    if (!callback) return console.log('No callback found for', ev)
    let done = false

    try {
      const rv = callback({
        io: this.#io,
        socket,
        user,
        event: ev,
        data,
        send: (data) => {
          const body = {
            status: 'success' as any,
            data,
          }

          if (done || !resolve) return body
          done = true

          resolve(body)
          return body
        },
      })

      if (rv instanceof Promise) await rv
    } catch (err) {
      if (done || !resolve) return
      done = true

      try {
        const [message, statusCode = 400] = getErrorInfo(err)
        resolve({ status: statusCode < 500 ? 'fail' : 'error', message })
      } catch {}
    }
  }
}
