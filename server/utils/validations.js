import { body } from 'express-validator';

export const register = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть больше 5 символов').isLength({ min: 5 }),
  body('userName', 'Имя должно быть больше 3 символов').isLength({ min: 3 }),
  body('userAvatar', 'Неверный формат изображения').optional().isURL(),
];

export const login = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть больше 5 символов').isLength({ min: 5 }),
];

export const postCreate = [
  body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
  body('text', 'Введите текст статьи').isLength({ min: 3 }).isString(),
  body('tags', 'Неверный формат тэгов').optional().isArray(),
  body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];
