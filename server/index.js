const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const { parse } = require('json2csv')
const { searchContributors, searchCommittees } = require('./lib/search')
const {
  getCandidateSummary,
  getCandidateContributions,
} = require('./lib/queries')
const { getClient } = require('./db')
const app = express()
app.use(bodyParser.json())
const { PORT: port = 3001 } = process.env
const TRIGRAM_LIMIT = 0.6

const handleError = (error, res) => {
  console.error(error)
  res.status(500)
  const { NODE_ENV } = process.env
  const message =
    NODE_ENV === 'development'
      ? `unable to process request: ${error.message}`
      : 'unable to process request'
  res.send({ error: message })
}

/**
 * Takes an array of data and sends a CSV file
 * The field names of the first item in the array will be the header row
 * @param {Array<Object>} data
 * @param {String} filename
 * @param {import('express').Response} res
 */
const sendCSV = (data, filename, res) => {
  res.setHeader('Content-type', 'application/octet-stream')
  res.setHeader('Content-disposition', `attachment; filename=${filename}`)

  const fields = Object.keys(data[0])
  const csv = parse(data, { fields })
  res.send(csv)
}

const api = express.Router()
api.use(bodyParser.json())
api.get('/search/contributors/:name', async (req, res) => {
  try {
    const { name } = req.params
    const { offset = 0, limit = 50 } = req.query
    const decodedName = decodeURIComponent(name)

    const contributors = await searchContributors(
      decodedName,
      offset,
      limit,
      TRIGRAM_LIMIT
    )
    return res.send(contributors)
  } catch (error) {
    handleError(error, res)
  }
})

api.get('/search/candidates/:name', async (req, res) => {
  try {
    const { name } = req.params
    const { offset = 0, limit = 50 } = req.query
    const decodedName = decodeURIComponent(name)

    const committees = await searchCommittees(
      decodedName,
      offset,
      limit,
      TRIGRAM_LIMIT
    )
    return res.send(committees)
  } catch (error) {
    handleError(error, res)
  }
})

api.get('/candidate/:ncsbeID', async (req, res) => {
  let client = null
  try {
    let { ncsbeID = '' } = req.params
    ncsbeID = decodeURIComponent(ncsbeID)
    if (!ncsbeID) {
      res.status(500)
      return res.send({
        error: 'empty ncsbeID',
      })
    }

    client = await getClient()
    const candidate = await client.query(
      `select * from committees
      where upper(committees.sboe_id) = upper($1)`,
      [ncsbeID]
    )
    return res.send({
      data: candidate.rows.length > 0 ? candidate.rows[0] : [],
    })
  } catch (error) {
    handleError(error, res)
  } finally {
    if (client !== null) {
      client.release()
    }
  }
})

api.get('/candidate/:ncsbeID/contributions', async (req, res) => {
  let client = null
  try {
    let { ncsbeID = '' } = req.params
    const { limit = 50, offset = 0, toCSV = false } = req.query
    ncsbeID = decodeURIComponent(ncsbeID)
    if (!ncsbeID) {
      res.status(500)
      return res.send({
        error: 'empty ncsbeID',
      })
    }
    client = await getClient()

    if (!toCSV) {
      const contributionsPromise = getCandidateContributions({
        ncsbeID,
        limit,
        offset,
        client,
      })

      const summaryPromise = getCandidateSummary(ncsbeID, client)

      const [contributions, summary] = await Promise.all([
        contributionsPromise,
        summaryPromise,
      ])

      return res.send({
        data: contributions.rows,
        count:
          contributions.rows.length > 0 ? contributions.rows[0].full_count : 0,
        summary,
      })
    } else {
      const contributions = await getCandidateContributions({ ncsbeID, client })

      if (contributions.rows.length < 1) {
        return handleError(
          new Error(`no results found for candidate with id: ${ncsbeID}`),
          res
        )
      }

      sendCSV(contributions.rows, `${ncsbeID}_contributions.csv`, res)
    }
  } catch (error) {
    handleError(error, res)
  } finally {
    if (client !== null) {
      client.release()
    }
  }
})

api.get('/contributors/:contributorId/contributions', async (req, res) => {
  let client = null
  try {
    const { contributorId } = req.params
    const { limit = 50, offset = 0 } = req.query
    client = await getClient()
    const contributions = await client.query(
      `select *, count(*) over () as full_count from contributions
      where contributor_id = $1
      order by contributions.date_occurred asc
      limit $2
      offset $3
      `,
      [contributorId, limit, offset]
    )
    return res.send({
      data: contributions.rows,
      count:
        contributions.rows.length > 0 ? contributions.rows[0].full_count : 0,
    })
  } catch (error) {
    handleError(error, res)
  } finally {
    if (client !== null) {
      client.release()
    }
  }
})

api.get('/candidates/:year', async (req, res) => {
  let client = null
  try {
    const { year } = req.params
    const { limit = 50, offset = 0 } = req.query
    client = await getClient()
    // NB: in rare cases, there are individuals who have > 1
    // committee and candidacy in a given year. This endpoint
    // will return each candidacy such individuals.
    const candidates = await client.query(
      `with candidates_for_year as (
        select
          distinct on (committees.sboe_id)
          committees.sboe_id,
          candidate_last_name, candidate_first_name, candidate_middle_name,
          party, office, candidate_full_name, candidate_first_last_name

        from committees
        inner join contributions
        on contributions.committee_sboe_id = committees.sboe_id
        where date_part('year', to_date(contributions.date_occurred, 'MM/DD/YY')) = $1
      )
      select *, count(*) over () as full_count
      from candidates_for_year
      order by candidate_full_name
      limit $2
      offset $3
      `,
      [year, limit, offset]
    )
    return res.send({
      data: candidates.rows,
      count: candidates.rows.length > 0 ? candidates.rows[0].full_count : 0,
    })
  } catch (error) {
    handleError(error, res)
  } finally {
    if (client !== null) {
      client.release()
    }
  }
})

api.get('/contributors/:year', async (req, res) => {
  let client = null
  try {
    const { year } = req.params
    const { limit = 50, offset = 0 } = req.query
    client = await getClient()
    const contributors = await client.query(
      `select *, count(*) over () as full_count from contributors
      inner join contributions on
      contributions.contributor_id = contributors.id
      where date_part('year', to_date(contributions.date_occurred, 'MM/DD/YY')) = $1
      order by contributors.name
      limit $2
      offset $3
      `,
      [year, limit, offset]
    )
    return res.send({
      data: contributors.rows,
      count: contributors.rows.length > 0 ? contributors.rows[0].full_count : 0,
    })
  } catch (error) {
    handleError(error, res)
  } finally {
    if (client !== null) {
      client.release()
    }
  }
})

api.get('/search/candidates-donors-pacs/:name', async (req, res) => {
  let client = null
  try {
    const { name } = req.params
    const { limit = 50 } = req.query
    const decodedName = decodeURIComponent(name)

    client = await getClient()

    const committees = await searchCommittees(
      decodedName,
      0,
      limit,
      TRIGRAM_LIMIT
    )
    const donors = await searchContributors(
      decodedName,
      0,
      limit,
      TRIGRAM_LIMIT
    )

    return res.send({
      candidates: committees,
      donors: {
        data: donors.data,
        count: donors.data.length > 0 ? donors.data[0].full_count : 0,
      },
      // this is placeholder until we include real pacs data
      pacs: {
        data: [],
        count: '0',
      },
    })
  } catch (error) {
    handleError(error, res)
  } finally {
    if (client !== null) {
      client.release()
    }
  }
})

app.use('/api', api)
app.get('/status', (req, res) => res.send({ status: 'online' }))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')))
  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
  })
}

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})
