import rateLimit, { MemoryStore } from 'express-rate-limit'

export const requestLimit = ({ duration = 3600000 /* 1 hour */, max }) => {
  return rateLimit({
    windowMs: duration,
    max,
    message: {
      status: 'fail',
      message: 'Too many requests, please try later',
    },
    store: new MemoryStore(),
  })
}
