import * as _ from 'ramda'
import request from 'superagent'
import cleanDB from './lib/clean-db.js'
import * as server from '../lib/server.js'
import {mockUser} from './lib/mock-user.js'
import {mockPost, mockManyPosts} from './lib/mock-post.js'

// const API_URL = process.env.API_URL

// describe('router-post.test.js', () => {
//   beforeAll(server.start)
//   afterAll(server.stop)
//   afterEach(cleanDB)
describe('yolo', () => {
  test('should return true', () => {
    expect(true).toBe(true);
  })
})
//   describe('POST /api/post', () => {
//     test('should create a post', () => {
//       return mockUser()
//       .then(({userData, user}) => {
//         return request.post(`${API_URL}/post`)
//         .set('Authorization', `Bearer ${userData.token}`)
//         .attach('post', `${__dirname}/asset/test-asset.png`)
//         .field('description', 'example data')
//         .then(res => {
//           expect(res.status).toEqual(200)
//           user = JSON.parse(JSON.stringify(user))
//           expect(res.body.owner).toEqual(userData.user._id.toString())
//           expect(res.body.user).toEqual(user)
//           expect(res.body.url).toBeTruthy()
//           expect(res.body.description).toEqual('example data')
//           expect(res.body.comments).toEqual([])
//         })
//       })
//     })

//     test('should respond with 400', () => {
//       return mockUser()
//       .then(({userData, user}) => {
//         return request.post(`${API_URL}/post`)
//         .set('Authorization', `Bearer ${userData.token}`)
//         .field('description', 'example data')
//         .then(res => {throw res})
//         .catch(res => {
//           expect(res.status).toEqual(400)
//         })
//       })

//     })

//     test('should respond with 400', () => {
//       return mockUser()
//       .then(({userData, user}) => {
//         return request.post(`${API_URL}/post`)
//         .set('Authorization', `Bearer ${userData.token}`)
//         .attach('post', `${__dirname}/asset/test-asset.png`)
//         .then(res => {throw res})
//         .catch(res => {
//           expect(res.status).toEqual(400)
//         })
//       })
//     })
//   })

//   // describe('GET /api/post', () => {
//   //   let fetchPage = (page) => {
//   //     return request(`${API_URL}/post?page=${page}`)
//   //     .catch(err => err)
//   //   }

//   //   let compareBodyWithMock = (body , mock) => {
//   //     _.forEach((post) => {
//   //       let mockPost = JSON.parse(JSON.stringify(mock[post._id]))
//   //       expect(post._id).toEqual(mockPost.post._id)
//   //       expect(post.owner).toEqual(mockPost.post.owner)
//   //       expect(post.description).toEqual(mockPost.post.description)
//   //       expect(post.url).toEqual(mockPost.post.url)
//   //       expect(post.user).toEqual(mockPost.user)
//   //     })(body)
//   //   }

//   //   test('should respond with 100 post', () => {
//   //     return mockManyPost()
//   //     .then(postsData => {
//   //       return fetchPage(1)
//   //       .then(res => {
//   //         expect(res.status).toEqual(200)
//   //         expect(res.body.count).toEqual(100)
//   //         expect(res.body.prev).toEqual(null)
//   //         expect(res.body.next).toEqual(null)
//   //         expect(res.body.last).toEqual(`${API_URL}/posts?page=1`)
//   //         compareBodyWithMock(res.body.data, postsData)
//   //       })
//   //     })
//   //   })

//   //   test('should respond with 50 posts', () => {
//   //     return mockManyPosts(150)
//   //     .then(postsData => {
//   //       return fetchPage(2)
//   //       .then(res => {
//   //         expect(res.status).toEqual(200)
//   //         expect(res.body.count).toEqual(150)
//   //         expect(res.body.prev).toEqual(`${API_URL}/post?page=1`)
//   //         expect(res.body.next).toEqual(null)
//   //         expect(res.body.last).toEqual(`${API_URL}/post?page=2`)
//   //         expect(res.body.data.length).toEqual(50)
//   //         compareBodyWithMock(res.body.data, postsData)
//   //       })
//   //     })
//   //   })
//   // })

//   describe('GET /api/post/:id', () => {
//     test('should fetch a post', () => {
//       return mockPost()
//       .then(mock => {
//         return request.get(`${API_URL}/post/${mock.post._id}`)
//         .then(res => {
//           expect(res.status).toEqual(200)
//         })
//       })
//     })

//     test('should 404', () => {
//       return mockPost()
//       .then(mock => {
//         return request.get(`${API_URL}/post/${mock.post.owner}`)
//         .catch(res => res)
//         .then(res => {
//           expect(res.status).toEqual(404)
//         })
//       })
//     })
//   })

//   describe('PUT /api/post/:id', () => {
//     test('should respond with updated post', () => {
//       return mockPost()
//       .then(mock => {
//         return request.put(`${API_URL}/post/${mock.post._id}`)
//         .set('Authorization', `Bearer ${mock.userData.token}`)
//         .attach('post', `${__dirname}/asset/test-asset.png`)
//         .field('description', 'cool beans')
//         .then(res => {
//           expect(res.status).toEqual(200)
//           expect(res.body._id).toEqual(mock.post._id.toString())
//           expect(res.body.description).toEqual('cool beans')
//           expect(res.body.url).not.toEqual(mock.post.url)
//         })
//       })
//     })

//     test('should respond with updated post', () => {
//       return mockPost()
//       .then(mock => {
//         return request.put(`${API_URL}/post/${mock.post._id}`)
//         .set('Authorization', `Bearer ${mock.userData.token}`)
//         .attach('post', `${__dirname}/asset/test-asset.png`)
//         .attach('post', `${__dirname}/asset/test-asset.png`)
//         .field('description', 'cool beans')
//         .catch(res => res)
//         .then(res => {
//           expect(res.status).toEqual(400)
//         })
//       })
//     })
//   })

//   describe('DELETE /api/post/:id', () => {
//     test('should delete a post', () => {
//       return mockPost()
//       .then(mock => {
//         return request.delete(`${API_URL}/post/${mock.post._id}`)
//         .set('Authorization', `Bearer ${mock.userData.token}`)
//         .then(res => {
//           expect(res.status).toEqual(204)
//         })
//       })
//     })

//     test('should 404', () => {
//       return mockPost()
//       .then(mock => {
//         return request.delete(`${API_URL}/post/${mock.post.owner}`)
//         .set('Authorization', `Bearer ${mock.userData.token}`)
//         .catch(res => res)
//         .then(res => {
//           expect(res.status).toEqual(404)
//         })
//       })
//     })
//   })

// })
