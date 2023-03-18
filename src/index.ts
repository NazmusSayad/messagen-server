import 'manual-node-env'
import 'req-error/global'
import { config } from 'dotenv'
config()

console.log('---', new Date().toString())

import './database'
import server from './server'
import root from './socket'

root.attach(server)
