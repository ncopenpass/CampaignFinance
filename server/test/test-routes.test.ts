import http from 'http'
import chai from 'chai'
// eslint-disable-next-line no-unused-vars
const deepEqualInAnyOrder = require('deep-equal-in-any-order')
const supertest = require('supertest')

import app from '../app'
import { setUpDb, seedDb, dropRows, tearDownDb } from './utils'
import { getClient } from '../db'

const { PORT: port = 3001 } = process.env

chai.should()
chai.use(deepEqualInAnyOrder)

let server: http.Server

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
  'candidate_first_last_name',
  'candidate_first_name',
  'candidate_full_name',
  'candidate_last_name',
  'candidate_middle_name',
  'committee_name',
  'current_status',
  'juris',
  'office',
  'party',
  'committee_sboe_id',
]

const expectedCommitteeKeys = [
  'committee_name',
  'office',
  'party',
  'committee_sboe_id',
  'city',
  'state',
]

const expectedContributorKeys = [
  'contributor_id',
  'name',
  'city',
  'state',
  'zipcode',
  'profession',
  'employer_name',
]

const expectedContributionKeys = [
  'account_code',
  'amount',
  'candidate_referendum_name',
  'committee_sboe_id',
  'contributor_id',
  'date_occurred',
  'declaration',
  'form_of_payment',
  'purpose',
  'report_name',
  'transaction_type',
]

const expectedContributionCommitteeKeys = [
  'account_code',
  'amount',
  'candidate_referendum_name',
  'committee_sboe_id',
  'committee_name',
  'candidate_full_name',
  'contributor_id',
  'date_occurred',
  'declaration',
  'form_of_payment',
  'purpose',
  'report_name',
  'transaction_type',
  'total_contributions_to_committee',
]

// Combine contributor and contribution fields and remove duplicates
const expectedContributorContributionsKeys = [
  ...new Set([...expectedContributionKeys, ...expectedContributorKeys]),
]

const expectedCommitteeContributorKeys = [
  'account_code',
  'amount',
  'city',
  'committee_sboe_id',
  'contributor_id',
  'date_occurred',
  'declaration',
  'employer_name',
  'form_of_payment',
  'name',
  'profession',
  'purpose',
  'report_name',
  'state',
  'transaction_type',
  'zipcode',
]

describe('GET /status', function () {
  it('it should have status 200 and online status', async function () {
    try {
      const response = await supertest(app).get('/status')
      response.status.should.equal(200)
      response.body.should.deep.equal({ status: 'online' })
    } catch (err) {
      console.error(err)
    }
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

describe('GET /api/search/committees/:name', function () {
  it('it should have status 200 and correct schema', async function () {
    const client = await getClient()
    const { rows } = await client.query(
      'select committee_name from committees limit 1',
      []
    )
    client.release()
    const name = encodeURIComponent(rows[0].committee_name)
    const response = await supertest(app).get(`/api/search/committees/${name}`)
    response.status.should.equal(200)
    response.body.should.be.an('object').that.has.all.keys(['data', 'count'])
    response.body.data[0].should.be
      .an('object')
      .that.has.all.keys(expectedCommitteeKeys)
    Object.keys(response.body.data[0]).length.should.equal(
      expectedCommitteeKeys.length
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
    response.body.should.be.an('object').that.has.all.keys(['data'])
    response.body.data.should.be
      .an('object')
      .that.has.all.keys(expectedCandidateKeys)
    Object.keys(response.body.data).length.should.equal(
      expectedCandidateKeys.length
    )
  })
})

describe('GET /api/candidate/:ncsbeID/contributions/summary', function () {
  it('it should have status 200 and correct schema', async function () {
    const client = await getClient()
    const { rows } = await client.query(
      `select sboe_id FROM committees
      inner join contributions
      on committees.sboe_id = contributions.canon_committee_sboe_id
      limit 1`,
      []
    )
    client.release()

    const id = encodeURIComponent(rows[0].sboe_id)

    const expectedSummaryKeys = [
      'sum',
      'avg',
      'max',
      'count',
      'aggregated_contributions_count',
      'aggregated_contributions_sum',
    ]

    const response = await supertest(app).get(
      `/api/candidate/${id}/contributions/summary`
    )
    response.status.should.equal(200)
    response.body.data.should.be
      .an('object')
      .that.has.all.keys(expectedSummaryKeys)
    Object.keys(response.body.data).length.should.equal(
      expectedSummaryKeys.length
    )
  })
})

describe('GET /api/candidate/:ncsbeID/contributions', function () {
  it('it should have status 200 and correct schema', async function () {
    const client = await getClient()
    const { rows } = await client.query(
      `select sboe_id FROM committees
      inner join contributions
      on committees.sboe_id = contributions.canon_committee_sboe_id
      limit 1`,
      []
    )
    client.release()
    const id = encodeURIComponent(rows[0].sboe_id)
    const response = await supertest(app).get(
      `/api/candidate/${id}/contributions`
    )

    response.status.should.equal(200)
    response.body.should.be.an('object').that.has.all.keys(['data', 'count'])
    response.body.data[0].should.be
      .an('object')
      .that.has.all.keys(expectedContributorContributionsKeys)
    Object.keys(response.body.data[0]).length.should.equal(
      expectedContributorContributionsKeys.length
    )
  })
})

describe('GET /api/candidate/:ncsbeID/contributions CSV download', function () {
  it('it should have status 200 and right headers', async function () {
    const client = await getClient()
    const { rows } = await client.query(
      `select sboe_id FROM committees
      inner join contributions
      on committees.sboe_id = contributions.canon_committee_sboe_id
      limit 1`,
      []
    )
    client.release()
    const id = encodeURIComponent(rows[0].sboe_id)
    const response = await supertest(app)
      .get(`/api/candidate/${id}/contributions`)
      .query({ toCSV: 'true' })
      .set('Accept', 'text/csv')
      .set('Content-Type', 'text/csv')
    response.status.should.equal(200)
    response.text
      .split('\n')[0]
      .split(',')
      .map((item: string) => item.replace(/"/g, ''))
      .should.deep.equalInAnyOrder(expectedContributorContributionsKeys)
  })
})

describe('GET /api/committee/:ncsbeID/contributions CSV download', function () {
  it('it should have status 200 and right headers', async function () {
    const client = await getClient()
    const { rows } = await client.query(
      `select sboe_id FROM committees
      inner join contributions
      on committees.sboe_id = contributions.canon_committee_sboe_id
      limit 1`,
      []
    )
    client.release()
    const id = encodeURIComponent(rows[0].sboe_id)
    const response = await supertest(app)
      .get(`/api/committee/${id}/contributions`)
      .query({ toCSV: 'true' })
      .set('Accept', 'text/csv')
      .set('Content-Type', 'text/csv')
    response.status.should.equal(200)
    response.text
      .split('\n')[0]
      .split(',')
      .map((item: string) => item.replace(/"/g, ''))
      .should.deep.equalInAnyOrder(expectedContributorContributionsKeys)
  })
})

describe('GET /api/contributor/:contributorId/contributions CSV download', function () {
  it('it should have status 200 and right headers', async function () {
    const client = await getClient()
    const { rows } = await client.query(
      `select account_id from contributors limit 1`,
      []
    )
    client.release()
    const id = encodeURIComponent(rows[0].account_id)
    const response = await supertest(app)
      .get(`/api/contributor/${id}/contributions`)
      .query({ toCSV: 'true' })
      .set('Accept', 'text/csv')
      .set('Content-Type', 'text/csv')
    response.status.should.equal(200)
    response.text
      .split('\n')[0]
      .split(',')
      .map((item: string) => item.replace(/"/g, ''))
      .should.deep.equalInAnyOrder(expectedContributionCommitteeKeys)
  })
})

describe('GET /api/contributor/:contributorId/contributions', function () {
  it('it should have status 200 and correct schema', async function () {
    const client = await getClient()
    const { rows } = await client.query(
      'select account_id FROM contributors limit 1',
      []
    )
    client.release()
    const id = encodeURIComponent(rows[0].account_id)
    const response = await supertest(app).get(
      `/api/contributor/${id}/contributions`
    )
    response.status.should.equal(200)
    response.body.should.be.an('object').that.has.all.keys(['data', 'count'])
    response.body.data[0].should.be
      .an('object')
      .that.has.all.keys(expectedContributionCommitteeKeys)
    Object.keys(response.body.data[0]).length.should.equal(
      expectedContributionCommitteeKeys.length
    )
  })
})

describe('GET /api/contributor/:contributorId', function () {
  it('it should have status 200 and correct schema', async function () {
    const client = await getClient()
    const { rows } = await client.query(
      'select account_id FROM contributors limit 1',
      []
    )
    client.release()
    const id = encodeURIComponent(rows[0].account_id)
    const response = await supertest(app).get(`/api/contributor/${id}`)
    response.status.should.equal(200)
    response.body.should.be.an('object').that.has.all.keys(['data'])
    response.body.data.should.be
      .an('object')
      .that.has.all.keys(expectedContributorKeys)
    Object.keys(response.body.data).length.should.equal(
      expectedContributorKeys.length
    )
  })
  it('it should have status 404 and data=null when contributor id is not found', async function () {
    const client = await getClient()
    client.release()
    const id = encodeURIComponent('0')
    const response = await supertest(app).get(`/api/contributor/${id}`)
    response.status.should.equal(404)
    response.body.should.be.an('object').that.has.all.keys(['data'])
    chai.should().equal(response.body.data, null)
  })
})

describe('GET /api/committee/:ncsbeID', function () {
  it('it should have status 200 and correct schema', async function () {
    const client = await getClient()
    const { rows } = await client.query(
      'select sboe_id from committees where sboe_id is not null limit 1',
      []
    )
    client.release()
    const sboe_id = encodeURIComponent(rows[0].sboe_id)
    const response = await supertest(app).get(`/api/committee/${sboe_id}`)
    response.status.should.equal(200)
    response.body.should.be.an('object').that.has.all.keys(['data'])
    response.body.data.should.be
      .an('object')
      .that.has.all.keys(expectedCommitteeKeys)
    Object.keys(response.body.data).length.should.equal(
      expectedCommitteeKeys.length
    )
  })
})

describe('GET /api/committee/:ncsbeID/contributions/summary', function () {
  it('it should have status 200 and correct schema', async function () {
    const client = await getClient()
    const { rows } = await client.query(
      `select sboe_id FROM committees
      inner join contributions
      on committees.sboe_id = contributions.canon_committee_sboe_id
      limit 1`,
      []
    )
    client.release()

    const id = encodeURIComponent(rows[0].sboe_id)

    const expectedSummaryKeys = [
      'sum',
      'avg',
      'max',
      'count',
      'aggregated_contributions_count',
      'aggregated_contributions_sum',
    ]

    const response = await supertest(app).get(
      `/api/committee/${id}/contributions/summary`
    )
    response.status.should.equal(200)
    response.body.data.should.be
      .an('object')
      .that.has.all.keys(expectedSummaryKeys)
    Object.keys(response.body.data).length.should.equal(
      expectedSummaryKeys.length
    )
  })
})

describe('GET /api/committee/:ncsbeID/contributions', function () {
  it('it should have status 200 and correct schema', async function () {
    const client = await getClient()
    const { rows } = await client.query(
      `select sboe_id FROM committees
      inner join contributions
      on committees.sboe_id = contributions.canon_committee_sboe_id
      limit 1`,
      []
    )
    client.release()
    const id = encodeURIComponent(rows[0].sboe_id)
    const response = await supertest(app).get(
      `/api/committee/${id}/contributions`
    )

    response.status.should.equal(200)
    response.body.should.be.an('object').that.has.all.keys(['data', 'count'])
    response.body.data[0].should.be
      .an('object')
      .that.has.all.keys(expectedCommitteeContributorKeys)
    Object.keys(response.body.data[0]).length.should.equal(
      expectedCommitteeContributorKeys.length
    )
  })
})
