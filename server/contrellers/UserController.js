import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';

import UserModel from '../models/User.js';

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array())
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      userName: req.body.userName,
      userAvatar: req.body.userAvatar,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign({
      _id: user._id
    },
    'secretKey',
    {
      expiresIn: '30d',
    });

    const { passwordHash, ...userData } = user._doc;

    return res.json({
      ...userData,
      token
    });
  } catch (err) {
    console.log('Ошибка в регистрации, 500: ', err);
    return res.status(500).json({
      msg: 'Не удалось зарегистроваться',
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      email: req.body.email
    });

    if (!user) {
      console.log('Ошибка в авторизации, 404');
      return res.status(403).json({
        msg: 'Не удалось авторизоваться',
      });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if (!isValidPass) {
      console.log('Логин и пароль не подходят');
      return res.status(403).json({
        msg: 'Не удалось авторизоваться',
      });
    }

    const token = jwt.sign({
        _id: user._id
      },
      'secretKey',
      {
        expiresIn: '30d',
    });

    const { passwordHash, ...userData } = user._doc;

    return res.json({
      ...userData,
      token
    });
  } catch (err) {
    console.log('Ошибка в авторизации, 500: ', err);
    return res.status(500).json({
      msg: 'Не удалось авторизоваться',
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        msg: 'Пользователь не найден',
      });
    }

    const { passwordHash, ...userData } = user._doc;

    return res.json(userData);
  } catch (err) {
    return res.status(500).json({
      msg: `Нет доступа`,
    });
  }
};
