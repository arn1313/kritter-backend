import * as _ from 'ramda'
import request from 'superagent'
import cleanDB from './lib/clean-db.js'
import * as server from '../lib/server.js'
import {mockUser, mockSingleUser, mockManyUsers} from './lib/mock-user.js'

const API_URL = process.env.API_URL

describe('router-user', () => {
  beforeAll(server.start)
  afterAll(server.stop)
  afterEach(cleanDB)

  describe('POST /users', () => {
    let postJSONUser = (data) =>
      mockUser()
      .then(userData => {
        return request.post(`${API_URL}/users`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${userData.token}`)
        .send(data)
        .then(res => ({res, userData}))
      })

    let postMultipartUser = (data) =>
      mockUser()
      .then(userData => {
        return request.post(`${API_URL}/users`)
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', `Bearer ${userData.token}`)
        .attach('avatar', `${__dirname}/asset/test-asset.png`)
        .field('bio', data.bio)
        .then(res => ({res, userData}))
      })

    test('json post should respond with a user', () => {
      return postJSONUser({bio: 'cool beans'})
      .then(({res, userData}) => {
        expect(res.status).toEqual(200)
      })
    })

    test('multiparty post should respond with a user', () => {
      return postMultipartUser({bio: 'cool beans'})
      .then(({res, userData}) => {
        expect(res.status).toEqual(200)
        expect(res.body.bio).toEqual('cool beans')
        expect(res.body.owner).toEqual(userData.user._id.toString())
        expect(res.body.email).toEqual(userData.user.email)
        expect(res.body.username).toEqual(userData.user.username)
      })
    })
  })

  describe('GET /users', () => {
    let getUserIdMap = _.reduce((result, next) =>
      ({...result, [next.user._id]: JSON.parse(JSON.stringify(next))}) , {})

    let compareMockWithResponse = (data) => {
      let dataById = getUserIdMap(data)
      return _.forEach(user => {
        let mockedData = dataById[user._id]
        expect(user.owner).toEqual(mockedData.user.owner)
        expect(user.username).toEqual(mockedData.user.username)
        expect(user.email).toEqual(mockedData.user.email)
        expect(user.bio).toEqual(mockedData.user.bio)
        expect(user.avatar).toEqual(mockedData.user.avatar)
      })
    }

    test('should return 100 users', () => {
       return mockManyUsers(175)
      .then((userData) => {
        return request.get(`${API_URL}/users`)
        .then(res => {
          expect(res.status).toEqual(200)
          expect(res.body.count).toEqual(175)
          expect(res.body.data.length).toEqual(100)
          expect(res.body.prev).toEqual(null)
          expect(res.body.next).toEqual(`${API_URL}/users?page=2`)
          expect(res.body.last).toEqual(`${API_URL}/users?page=2`)
          compareMockWithResponse(userData)(res.body.data)
        })
      })
    })

    test('?page=2 should return 50 users', () => {
     return mockManyUsers(150)
      .then((userData) => {
        return request.get(`${API_URL}/users?page=2`)
        .then(res => {
          expect(res.status).toEqual(200)
          expect(res.body.count).toEqual(150)
          expect(res.body.data.length).toEqual(50)
          expect(res.body.next).toEqual(null)
          expect(res.body.prev).toEqual(`${API_URL}/users?page=1`)
          expect(res.body.last).toEqual(`${API_URL}/users?page=2`)
          compareMockWithResponse(userData)(res.body.data)
        })
      })
    })

    test('?page=-1 should return 10 users', () => {
     return mockManyUsers(10)
      .then((userData) => {
        return request.get(`${API_URL}/users?page=-1`)
        .then(res => {
          expect(res.status).toEqual(200)
          expect(res.body.count).toEqual(10)
          expect(res.body.prev).toEqual(null)
          expect(res.body.next).toEqual(null)
          expect(res.body.last).toEqual(`${API_URL}/users?page=1`)
          compareMockWithResponse(userData)(res.body.data)
        })
      })
    })

    test('?page=2 should return 100 users', () => {
     return mockManyUsers(300)
      .then((userData) => {
        return request.get(`${API_URL}/users?page=2`)
        .then(res => {
          expect(res.status).toEqual(200)
          expect(res.body.count).toEqual(300)
          expect(res.body.prev).toEqual(`${API_URL}/users?page=1`)
          expect(res.body.next).toEqual(`${API_URL}/users?page=3`)
          expect(res.body.last).toEqual(`${API_URL}/users?page=3`)
          expect(res.body.data.length).toEqual(100)
          compareMockWithResponse(userData)(res.body.data)
        })
      })
    })

    test('?page=3 should return 0 users', () => {
     return mockManyUsers(10)
      .then(({userData, users}) => {
        return request.get(`${API_URL}/users?page=3`)
        .then(res => {
          expect(res.status).toEqual(200)
          expect(res.body.count).toEqual(10)
          expect(res.body.prev).toEqual(null)
          expect(res.body.next).toEqual(null)
          expect(res.body.last).toEqual(`${API_URL}/users?page=1`)
          expect(res.body.data.length).toEqual(0)
        })
      })
    })
  })

  describe('GET /users/:id', () => {
    test('should return a user', () => {
      return mockSingleUser()
      .then(({userData, user}) => {
        return request.get(`${API_URL}/users/${user._id}`)
        .then(res => {
          expect(res.status).toEqual(200)
          user = JSON.parse(JSON.stringify(user))
          expect(res.body).toEqual(user)
        })
      })
    })

    test('should return a 404', () => {
      return request.get(`${API_URL}/users/597e89cbcc524228f3c8092e`)
      .catch(res => {
        expect(res.status).toEqual(404)
      })
    })
  })

  describe('GET /users/me', () => {
    test('should return user user', () => {
      return mockSingleUser()
      .then(mock => {
        return request(`${API_URL}/users/me`)
        .set('Authorization', `Bearer ${mock.userData.token}`)
        .then(res => {
          expect(res.status).toEqual(200)
          expect(res.body.owner).toEqual(mock.userData.user._id.toString())
        })
      })
    })
  })

  describe('PUT /users/:id', () => {
    let putJSONUser = (bio) => {
      return mockSingleUser()
      .then(({userData, user}) => {
        return request.put(`${API_URL}/users/${user._id}`)
        .set('Authorization', `Bearer ${userData.token}`)
        .send({bio})
        .then(res => ({res, userData, user}))
      })
    }

    let putMultipartUser = (bio) => {
      return mockSingleUser()
      .then(({userData, user}) => {
        return request.put(`${API_URL}/users/${user._id}`)
        .set('Authorization', `Bearer ${userData.token}`)
        .field('bio', bio)
        .attach('avatar', `${__dirname}/asset/test-asset.png`)
        .then(res => ({res, userData, user}))
      })
    }

    test('should update the bio', () => {
      return putJSONUser('cool beans')
      .then(({res, user}) => {
        expect(res.status).toEqual(200)
        user = JSON.parse(JSON.stringify(user))
        expect(res.body).toEqual({...user, bio: 'cool beans'})
      })
    })

    test('should update the bio and avatar', () => {
      return putMultipartUser('cool beans')
      .then(({res, user}) => {
        expect(res.status).toEqual(200)
        user = JSON.parse(JSON.stringify(user))
        expect(res.body._id).toEqual(user._id)
        expect(res.body.email).toEqual(user.email)
        expect(res.body.username).toEqual(user.username)
        expect(res.body.bio).toEqual('cool beans')
        expect(res.body.avatar).not.toEqual(user.avatar)
      })
    })
  })

  describe('DELETE /users/:id', () => {
    test('should return a 204 status', () => {
      return mockSingleUser()
      .then(({userData, user}) => {
        return request.delete(`${API_URL}/users/${user._id}`)
        .set('Authorization', `Bearer ${userData.token}`)
        .then(res => {
          expect(res.status).toEqual(204)
        })
      })
    })

    test('should return a 404 status', () => {
      return mockSingleUser()
      .then(({userData, user}) => {
        return request.delete(`${API_URL}/users/${userData.user._id}`)
        .set('Authorization', `Bearer ${userData.token}`)
        .then(res => {throw res})
        .catch(res => {
          expect(res.status).toEqual(404)
        })
      })
    })
  })
})
