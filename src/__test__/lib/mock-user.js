import faker from 'faker'
import * as _ from 'ramda';
import User from '../../model/user.js'

export const mockUser = () => {
  let result = { password: faker.internet.password() }
  return User.create({
    username: faker.internet.userName() + faker.internet.userName(),
    email: faker.internet.userName() + faker.internet.email(),
    password: result.password,
    randomHash: faker.random.uuid() + faker.random.uuid(),
  })
  .then(user => {
    result.user = user
    return user.tokenCreate()
  })
  .then(token => {
    result.token = token
    return result
  })
}

export const mockSingleUser = () => {
  return mockUser()
  .then((userData) => {
    return new User({
      owner: userData.user.id,
      email: userData.user.email,
      username: userData.user.username,
      bio: faker.lorem.words(10),
      avatar: faker.image.image(),
    }).save()
    .then(user => {
      userData.user.user = user._id
      return userData.user.save()
      .then(() => user)
    })
    .then(user => ({userData, user}))
  })
}

export const mockManyUsers = (num=10) => {
  return Promise.all(_.map(() => mockSingleUser(), Array(num)))
}
