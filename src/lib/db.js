'use strict';

// DEPENDENCIES
import {log, error} from './util.js';
const mongoose = require('mongoose');
mongoose.Promise = Promise; 

// STATE
const state = { isOn: false };

// INTERFACE
export const start = () => {
  log('__DATABASE_UP__', process.env.MONGO_URI);
  if(state.isOn)
    return Promise.reject(new Error('USER ERROR: DATABASE is connected'));
  state.isOn = true;
  return mongoose.connect(process.env.MONGO_URI, {useMongoClient: true});
};

export const stop = () => {
  log('__DATABASE_DOWN__');
  if(!state.isOn)
    return Promise.reject(new Error('USER ERROR: DATABASE is disconnected'));
  state.isOn = false;
  return mongoose.disconnect();
};
