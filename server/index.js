import express from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import cors from 'cors';

import { handleValidationErrors, checkAuth, Validation } from './utils/index.js';
import { UserController, PostController } from './contrellers/index.js';

dotenv.config();
const login = process.env.DB_USER;
const pass = process.env.DB_PASSWORD;
const DBname = process.env.DB_NAME;
const PORT = process.env.PORT || '3000';

mongoose
  .connect(`mongodb+srv://${login}:${pass}@cluster0.p4p8r5j.mongodb.net/${DBname}?retryWrites=true&w=majority`)
  .then(() => {
    console.log('DB ok');
  })
  .catch((err) => {
    console.log('DB err: ', err);
  });

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', Validation.login, handleValidationErrors, UserController.login);
app.post('/auth/register', Validation.register, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get('/tags', PostController.getLastTags);

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.get('/posts/tags', PostController.getLastTags);
app.post('/posts', checkAuth, Validation.postCreate, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
  '/posts/:id',
  checkAuth,
  Validation.postCreate,
  handleValidationErrors,
  PostController.update,
);

app.listen(PORT, (err) => {
  if (err) {
    console.log('Server error: ', err);
  } else {
    console.log(`Server status: ok. PORT: ${PORT}`);
  }
});
