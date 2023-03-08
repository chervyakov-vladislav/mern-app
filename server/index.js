import express from 'express';
import mongoose from 'mongoose';

import * as Validation from './vlidations/validations.js';
import checkAuth from './utils/checkAuth.js';
import { UserController, PostController } from './contrellers/index.js';

// .env
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

app.post('/auth/login', Validation.login, UserController.login);
app.post('/auth/register', Validation.register, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.get('/posts/tags', PostController.getLastTags);
app.post('/posts', checkAuth, Validation.postCreate, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
  '/posts/:id',
  checkAuth,
  Validation.postCreate,
  PostController.update,
);

const PORT = 3000;

app.listen(PORT, (err) => {
  if (err) {
    console.log('Server error: ', err);
  } else {
    console.log(`Server status: ok. PORT: ${PORT}`);
  }
});
