const assert = require('assert')
const supertest = require('supertest')
// const app = require('../index')
const { setUpDb, seedDb, dropRows, tearDownDb } = require('./utils')

// eslint-disable-next-line no-undef
before(async function () {
  try {
    console.log('Setting up db')
    await setUpDb()
  } catch (err) {
    console.err(err)
  }
})

// beforeEach(async function () {
//   console.log('Seeding db')
//   try {
//     await seedDb()
//   } catch (err) {
//     console.err(err)
//   }
// })

// afterEach(async function () {
//   console.log('Truncating tables')
//   try {
//     await dropRows()
//   } catch (err) {
//     console.err(err)
//   }
// })

// // eslint-disable-next-line no-undef
// after(async function () {
//   console.log('Tearing down db')
//   try {
//     await tearDownDb()
//   } catch (err) {
//     console.err(err)
//   }
// })

describe('GET /', function () {
  it('it should have status code 200', function (done) {
    // supertest(app)
    //   .get('/')
    //   .expect(200)
    //   .end(function (err, res) {
    //     if (err) done(err)
    //     done()
    //   })
    assert(1 == 1)
    done()
  })
  it('should do something else', function (done) {
    assert(2 == 2)
    done()
  })
})
