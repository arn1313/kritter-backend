import User from './user.js';
import Photo from './post.js';

export default (db) => {
  User(db);
  Photo(db);
};
