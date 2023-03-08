import { body } from 'express-validator';

export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть больше 5 символов').isLength({ min: 5 }),
  body('userName', 'Имя должно быть больше 3 символов').isLength({ min: 3 }),
  body('userAvatar', 'Неверный формат изображения').optional().isURL(),
] 
