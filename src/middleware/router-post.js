import {Router} from 'express';
import {bearerAuth} from './parser-auth.js';
import parserBody from './parser-body.js';
import Post from '../model/post.js';

export default new Router()
  .post('/posts', bearerAuth, parserBody, (req, res, next) => {
    Post.create(req)
      .then(res.json)
      .catch(next);
  })
  .get('/posts', (req, res, next) => {
    Post.fetch(req)
      .then(res.page)
      .catch(next);
  })
  .get('/posts/me', bearerAuth, (req, res, next) => {
    Post.fetch(req, {owner: req.user._id})
      .then(res.page)
      .catch(next);
  })
  .get('/posts/:id', (req, res, next) => {
    Post.fetchOne(req)
      .then(res.json)
      .catch(next);
  })
  .put('/posts/:id', bearerAuth, parserBody, (req, res, next) => {
    Post.update(req)
      .then(res.json)
      .catch(next);
  })
  .delete('/posts/:id', bearerAuth, (req, res, next) => {
    Post.delete(req)
      .then(() => res.sendStatus(204))
      .catch(next);
  });
