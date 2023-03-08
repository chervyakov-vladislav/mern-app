import express from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import { registerValidation } from './vlidations/auth.js';
import UserModel from './models/User.js';

const login = 'vladislavech';
const pass = 'PRsc8l1ppY7aiFBJ';

mongoose
  .connect(`mongodb+srv://${login}:${pass}@cluster0.p4p8r5j.mongodb.net/blog?retryWrites=true&w=majority`)
  .then(() => {
    console.log('DB ok');
  })
  .catch((err) => {
    console.log('DB err: ', err);
  });

const app = express();

app.use(express.json())

app.post('/auth/login', async (req, res) => {
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
});

app.post('/auth/register', registerValidation, async (req, res) => {
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
});

app.get('/auth/me', (req, res) => {
  try {

  } catch (err) {}
});

const PORT = 3000;

app.listen(PORT, (err) => {
  if (err) {
    console.log('Server error: ', err);
  } else {
    console.log(`Server status: ok. PORT: ${PORT}`);
  }
});
