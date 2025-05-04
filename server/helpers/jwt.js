import jwt from 'jwt-simple'
import moment from 'moment'
import dotenv from 'dotenv'

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' })
} else {
  dotenv.config()
}

const secret = process.env.JWT_SECRET

const createToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    role: user.role,
    profile: user.profile,
    location: user.location,
    iat: moment().unix(),
    exp: moment().add(30, 'days').unix()
  }

  return jwt.encode(payload, secret)
}

const decodeToken = (token) => {
  const decoded = jwt.decode(token, secret, true)
  return decoded
}

const verifyToken = (token) => {
  try {
    const decoded = decodeToken(token)
    if (decoded.exp <= moment().unix()) {
      return { valid: false, message: 'Token expired' }
    }
    return { valid: true, decoded }
  } catch (error) {
    return { valid: false, message: 'Invalid token' }
  }
}

export default {
  createToken,
  decodeToken,
  verifyToken
}
