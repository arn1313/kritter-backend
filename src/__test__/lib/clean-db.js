import fs from 'fs-extra'
import User from '../../model/user.js'
import Post from '../../model/post.js'

export default () => Promise.all([
  fs.remove(`${__dirname}/../../../temp/*`),
    User.remove({}),
    Post.remove({}),
  ])
