import 'manual-node-env'
import 'req-error/global'
import { config } from 'dotenv'
config()

console.log('---', new Date().toString())

if (process.env.NODE_ENV === 'development') {
  console.clear()
}

import './database'
import server from './server'
import root from './socket'

root.attach(server)
