'use strict';
import superagent from 'superagent';
import {Router} from 'express';
import User from '../model/user.js';
import parserBody from './parser-body.js';
import {basicAuth, bearerAuth} from './parser-auth.js';
import {log, daysToMilliseconds} from '../lib/util.js';

export default new Router()

  .post('/signup', parserBody, (req, res, next) => {
    log('__ROUTE__ POST /signup');
    console.log(req.body, '__REQUEST ON SIGNUP_____')

    new User.create(req.body)
      .then(user => user.tokenCreate())
      .then(token => {
        res.cookie('X-Kritter-Token', token, {maxAge: 900000});

        res.send(token);
      })
      .catch(next);
  })

  .post('/profiles', bearerAuth, parserBody, (req, res, next) => {
    User.create(req)
      .then(res.json)
      .catch(next);
  })
  .get('/usernames/:username', (req, res, next) => {
    User.findOne({username: username})
      .then(user => {
        if(!user)
          return res.sendStatus(409);
        return res.sendStatus(200);
      })
      .catch(next);
  })
  .get('/login', basicAuth, (req, res, next) => {
    log('__ROUTE__ GET /login');
    req.user.tokenCreate()
      .then((token) => {
        let cookieOptions = {maxAge: daysToMilliseconds(7)};
        res.cookie('X-Kritter-Token', token, cookieOptions);
        res.send(token);
      })
      .catch(next);
  })

 //  .post('/users', bearerAuth, parserBody, (req, res, next) => {
 //   User.create(req)
 //     .then(res.json)
 //     .catch(next);
 // })

  .get('/users', (req, res, next) => {
    User.fetch(req)
      .then(res.page)
      .catch(next);
  })
  .get('/users/me', bearerAuth, (req, res, next) => {
    User.findOne({username: {owner: req.user._id}})
    .then(user => {
      console.log(user, '******user')
        if(!user)
          return next(createError(404, 'NOT FOUND ERROR: user not found'));
        res.json(user);
      })
      .catch(next);
  })

  .get('/users/:id', (req, res, next) => {
    User.fetchOne(req)
      .then(res.json)
      .catch(next);
  })
  .put('/users/:id', bearerAuth, parserBody, (req, res, next) => {
    User.update(req)
      .then(res.json)
      .catch(next);
  })
  .delete('/users/:id', bearerAuth, (req, res, next) => {
    User.delete(req)
      .then(() => res.sendStatus(204))
      .catch(next);
  });
