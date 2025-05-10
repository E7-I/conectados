import jwt from 'jwt-simple'
import moment from 'moment'
import libjwt from '../helpers/jwt.js'

const secret = libjwt.secret

export const auth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).send({ message: 'No token provided' })
  }

  const token = req.headers.authorization.replace(/['"]+/g, '')

  try {
    const payload = jwt.decode(token, secret)

    if (payload.exp <= moment().unix()) {
      return res.status(401).send({ message: 'Token has expired' })
    }
  } catch (error) {
    return res.status(404).send({ message: 'Invalid token' })
  }

  req.user = payload

  next()
}