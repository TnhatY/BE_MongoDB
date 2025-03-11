import crypto from 'crypto'

const key1 = crypto.randomBytes(32).toString('hex')
const key2 = crypto.randomBytes(32).toString('hex')
const key3 = crypto.randomBytes(32).toString('hex')
console.log(key3)
