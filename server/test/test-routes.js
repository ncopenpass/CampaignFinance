const http = require('http')
const chai = require('chai')
const supertest = require('supertest')

const app = require('../app')
const { setUpDb, seedDb, dropRows, tearDownDb } = require('./utils')
const { getClient } = require('../db')

const { PORT: port = 3001 } = process.env

chai.should()

let server

// eslint-disable-next-line no-undef
before(async function () {
  console.log('Setting up db')
  try {
    server = http.createServer(app)
    server.listen({ port })
    await setUpDb()
  } catch (err) {
    console.error(err)
  }
})

beforeEach(async function () {
  try {
    await seedDb()
  } catch (err) {
    console.error(err)
  }
})

afterEach(async function () {
  try {
    await dropRows()
  } catch (err) {
    console.error(err)
  }
})

// eslint-disable-next-line no-undef
after(async function () {
  console.log('Tearing down db')
  try {
    await tearDownDb()
    await server.close()
  } catch (err) {
    console.error(err)
  }
})

const expectedCandidateKeys = [
  'asst_treasurer_email',
  'asst_treasurer_first_name',
  'asst_treasurer_last_name',
  'asst_treasurer_middle_name',
  'candidate_first_last_name',
  'candidate_first_name',
  'candidate_full_name',
  'candidate_last_name',
  'candidate_middle_name',
  'committee_city',
  'committee_full_zip',
  'committee_name',
  'committee_state',
  'committee_street_1',
  'committee_street_2',
  'committee_type',
  'current_status',
  'first_last_sml',
  'full_count',
  'full_name_sml',
  'juris',
  'last_name_sml',
  'office',
  'party',
  'sboe_id',
  'treasurer_city',
  'treasurer_email',
  'treasurer_first_name',
  'treasurer_full_zip',
  'treasurer_last_name',
  'treasurer_middle_name',
  'treasurer_state',
  'treasurer_street_1',
  'treasurer_street_2',
]

const expectedContributorKeys = [
  'id',
  'name',
  'city',
  'state',
  'zip_code',
  'profession',
  'employer_name',
  'full_count',
  'sml',
]

const expectedContributionKeys = [
  'account_code',
  'amount',
  'candidate_or_referendum_name',
  'committee_city',
  'committee_name',
  'committee_sboe_id',
  'committee_state',
  'committee_street_1',
  'committee_street_2',
  'committee_zip_code',
  'contributor_id',
  'date_occurred',
  'declaration',
  'form_of_payment',
  'full_count',
  'purpose',
  'report_name',
  'source_contribution_id',
  'transaction_type',
]

describe('GET /status', function () {
  it('it should have status 200 and online status', async function () {
    const response = await supertest(app).get('/status')
    response.status.should.equal(200)
    response.body.should.deep.equal({ status: 'online' })
  })
})

describe('GET /api/search/contributors/:name', function () {
  it('it should have status 200 and correct schema', async function () {
    const client = await getClient()
    const { rows } = await client.query(
      'select name FROM contributors where name is not null limit 1',
      []
    )
    client.release()
    const name = encodeURIComponent(rows[0].name)
    const response = await supertest(app).get(
      `/api/search/contributors/${name}`
    )
    response.status.should.equal(200)
    response.body.should.be.an('object').that.has.all.keys(['data', 'count'])
    response.body.data[0].should.be
      .an('object')
      .that.has.all.keys(expectedContributorKeys)
    Object.keys(response.body.data[0]).length.should.equal(
      expectedContributorKeys.length
    )
  })
})

describe('GET /api/search/candidates/:name', function () {
  it('it should have status 200 and correct schema', async function () {
    const client = await getClient()
    const { rows } = await client.query(
      'select candidate_last_name from committees where candidate_last_name is not null limit 1',
      []
    )
    client.release()
    const name = encodeURIComponent(rows[0].candidate_last_name)
    const response = await supertest(app).get(`/api/search/candidates/${name}`)
    response.status.should.equal(200)
    response.body.should.be.an('object').that.has.all.keys(['data', 'count'])
    response.body.data[0].should.be
      .an('object')
      .that.has.all.keys(expectedCandidateKeys)
    Object.keys(response.body.data[0]).length.should.equal(
      expectedCandidateKeys.length
    )
  })
})

describe('GET /api/candidate/:ncsbeID', function () {
  it('it should have status 200 and correct schema', async function () {
    const client = await getClient()
    const { rows } = await client.query(
      'select sboe_id from committees where sboe_id is not null limit 1',
      []
    )
    client.release()
    const sboe_id = encodeURIComponent(rows[0].sboe_id)
    const response = await supertest(app).get(`/api/candidate/${sboe_id}`)
    response.status.should.equal(200)
    response.body.should.be.an('object').that.has.all.keys(['data', 'count'])
    response.body.data[0].should.be
      .an('object')
      .that.has.all.keys(expectedCandidateKeys)
    Object.keys(response.body.data[0]).length.should.equal(
      expectedCandidateKeys.length
    )
  })
})

describe('GET /api/contributors/:contributorId/contributions', function () {
  it('it should have status 200 and correct schema', async function () {
    const client = await getClient()
    const { rows } = await client.query(
      'select id FROM contributors limit 1',
      []
    )
    client.release()
    const id = encodeURIComponent(rows[0].id)
    const response = await supertest(app).get(
      `/api/contributors/${id}/contributions`
    )
    response.status.should.equal(200)
    response.body.should.be.an('object').that.has.all.keys(['data', 'count'])
    response.body.data[0].should.be
      .an('object')
      .that.has.all.keys(expectedContributionKeys)
    Object.keys(response.body.data[0]).length.should.equal(
      expectedContributionKeys.length
    )
  })
})

describe('GET /api/candidates/:year', function () {
  it('it should have status 200 and correct schema', async function () {
    const client = await getClient()
    const { rows } = await client.query(
      `select date_part('year', to_date(contributions.date_occurred, 'MM/DD/YY')) as year
      FROM contributions limit 1`,
      []
    )
    client.release()
    const year = rows[0].year
    const response = await supertest(app).get(`/api/candidates/${year}`)
    response.status.should.equal(200)
    response.body.should.be.an('object').that.has.all.keys(['data', 'count'])
    response.body.data[0].should.be
      .an('object')
      .that.has.all.keys(expectedCandidateKeys)
    Object.keys(response.body.data[0]).length.should.equal(
      expectedCandidateKeys.length
    )
  })
})

describe('GET /api/contributors/:year', function () {
  it('it should have status 200 and correct schema', async function () {
    const client = await getClient()
    const { rows } = await client.query(
      `select date_part('year', to_date(contributions.date_occurred, 'MM/DD/YY')) as year
      FROM contributions limit 1`,
      []
    )
    client.release()
    const year = rows[0].year
    const response = await supertest(app).get(`/api/contributors/${year}`)
    response.status.should.equal(200)
    response.body.should.be.an('object').that.has.all.keys(['data', 'count'])
    response.body.data[0].should.be
      .an('object')
      .that.has.all.keys(expectedContributorKeys)
    Object.keys(response.body.data[0]).length.should.equal(
      expectedContributorKeys.length
    )
  })
})

describe('GET /api/search/candidates-donors-pacs/:name', function () {
  it('it should have status 200 and correct schema', async function () {
    const client = await getClient()
    const { rows } = await client.query(
      'select candidate_last_name from committees where candidate_last_name is not null limit 1',
      []
    )
    client.release()
    const name = encodeURIComponent(rows[0].candidate_last_name)
    const response = await supertest(app).get(
      `/api/search/candidates-donors-pacs/${name}`
    )
    response.status.should.equal(200)
    const keys = ['data', 'count']

    ;[('candidates', 'donors', 'pacs')].forEach((item) => {
      response.body[item].should.be.an('object').that.has.all.keys(keys)
    })

    response.body.should.be
      .an('object')
      .that.has.all.keys(['candidates', 'donors', 'pacs'])
  })
})
