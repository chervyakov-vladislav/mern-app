import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();
const jwtKey = process.env.TOKEN_SECRET;

export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

  if (token) {
    try {
      const decoded = jwt.verify(token, jwtKey);

      req.userId = decoded._id;
      next();
    } catch (e) {
      return res.status(403).json({
        msg: 'Нет доступа',
      });
    }
  } else {
    return res.status(403).json({
      msg: 'Нет доступа',
    });
  }
}