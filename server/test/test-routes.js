const http = require('http')
const chai = require('chai')
// eslint-disable-next-line no-unused-vars
const deepEqualInAnyOrder = require('deep-equal-in-any-order')
const supertest = require('supertest')

const app = require('../app')
const { setUpDb, seedDb, dropRows, tearDownDb } = require('./utils')
const { getClient } = require('../db')

const { PORT: port = 3001 } = process.env

chai.should()
chai.use(deepEqualInAnyOrder)

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
  'candidate_first_last_name',
  'candidate_first_name',
  'candidate_full_name',
  'candidate_last_name',
  'candidate_middle_name',
  'current_status',
  'juris',
  'office',
  'party',
  'committee_sboe_id',
]

const expectedContributorKeys = [
  'contributor_id',
  'name',
  'city',
  'state',
  'zip_code',
  'profession',
  'employer_name',
]

const expectedContributionKeys = [
  'account_code',
  'amount',
  'candidate_or_referendum_name',
  'committee_sboe_id',
  'contributor_id',
  'date_occurred',
  'declaration',
  'form_of_payment',
  'purpose',
  'report_name',
  'source_contribution_id',
  'transaction_type',
]

const expectedContributionCommitteeKeys = [
  'account_code',
  'amount',
  'candidate_or_referendum_name',
  'committee_sboe_id',
  'committee_name',
  'candidate_full_name',
  'contributor_id',
  'date_occurred',
  'declaration',
  'form_of_payment',
  'purpose',
  'report_name',
  'source_contribution_id',
  'transaction_type',
  'total_contributions_to_committee',
]

// Combine contributor and contribution fields and remove duplicates
const expectedContributorContributionsKeys = [
  ...new Set([...expectedContributionKeys, ...expectedContributorKeys]),
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

describe('GET /api/candidate/:ncsbeID/contributions', function () {
  it('it should have status 200 and correct schema', async function () {
    const client = await getClient()
    const { rows } = await client.query(
      `select sboe_id FROM committees
      inner join contributions
      on committees.sboe_id = contributions.committee_sboe_id
      limit 1`,
      []
    )
    client.release()
    const id = encodeURIComponent(rows[0].sboe_id)
    const response = await supertest(app).get(
      `/api/candidate/${id}/contributions`
    )

    const expectedSummaryKeys = [
      'sum',
      'avg',
      'max',
      'count',
      'aggregated_contributions_count',
      'aggregated_contributions_sum',
    ]
    response.status.should.equal(200)
    response.body.should.be
      .an('object')
      .that.has.all.keys(['data', 'count', 'summary'])
    response.body.summary.should.be
      .an('object')
      .that.has.all.keys(expectedSummaryKeys)
    Object.keys(response.body.summary).length.should.equal(
      expectedSummaryKeys.length
    )
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
      on committees.sboe_id = contributions.committee_sboe_id
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
      .map((item) => item.replace(/"/g, ''))
      .should.deep.equalInAnyOrder(expectedContributorContributionsKeys)
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
      'select id FROM contributors limit 1',
      []
    )
    client.release()
    const id = encodeURIComponent(rows[0].id)
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
    const id = encodeURIComponent('00000000-0000-0000-0000-000000000000')
    const response = await supertest(app).get(`/api/contributor/${id}`)
    response.status.should.equal(404)
    response.body.should.be.an('object').that.has.all.keys(['data'])
    chai.should().equal(response.body.data, null)
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

    if (response.body.candidates.length > 0) {
      response.body.candidates[0].should.be
        .an('object')
        .that.has.all.keys(expectedCandidateKeys)
    }
    if (response.body.donors.length > 0) {
      response.body.donors[0].should.be
        .an('object')
        .that.has.all.keys(expectedContributorKeys)
    }
  })
})
