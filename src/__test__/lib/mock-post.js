import faker from 'faker'
import * as _ from 'ramda'
import Post from '../../model/post.js'
import {mockUser} from './mock-user.js'

export const mockPost = () => {
  return mockUser()
  .then(({user, userData}) => {
    return new Post({
      url: faker.image.image(),
      description: faker.lorem.sentence(),
      user: user._id,
      owner: userData.user._id,
      time
    })
    .save()
    .then(post => ({post, user, userData}))
  })
}

export const mockManyPosts = (count=100) => {
  return Promise.all(_.map(() => mockPost(), Array(count)))
  .then(postsData => {
    return _.reduce((result, next) => {
      return {...result, [next.post._id]: next}
    }, {}, postsData)
  })
}


