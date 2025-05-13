import jwt from 'jwt-simple'
import moment from 'moment'
import libjwt from '../helpers/jwt.js'

const secret = libjwt.secret

export const auth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).send({ message: 'No token provided' });
  }

  const token = req.headers.authorization.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : req.headers.authorization;

  try {
    console.log('Token:', token);
    console.log('Secret:', secret);
    const payload = libjwt.decodeToken(token);
    console.log('Payload:', payload);

    if (payload.exp <= moment().unix()) {
      return res.status(401).send({ message: 'Token has expired' });
    }

    req.user = payload;
    next();
  } catch (error) {
    return res.status(404).send({ message: 'Invalid token' });
  }
}
