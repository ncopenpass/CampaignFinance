const express = require('express')
const sanitize = require('sanitize-filename')
const { parse } = require('json2csv')

const { searchContributors, searchCommittees } = require('./lib/search')
const {
  getCandidateSummary,
  getCandidateContributions,
  getCandidate,
  getCandidateContributionsForDownload,
  getContributorContributions,
  getContributor,
} = require('./lib/queries')
const { getClient } = require('./db')

const TRIGRAM_LIMIT = 0.6

const apiReprCandidate = (row) => {
  return {
    candidate_first_last_name: row.candidate_first_last_name,
    candidate_first_name: row.candidate_first_name,
    candidate_full_name: row.candidate_full_name,
    candidate_last_name: row.candidate_last_name,
    candidate_middle_name: row.candidate_middle_name,
    current_status: row.current_status,
    juris: row.juris,
    office: row.office,
    party: row.party,
    committee_sboe_id: row.sboe_id,
  }
}

const apiReprContributor = (row) => {
  return {
    contributor_id: row.id,
    name: row.name,
    city: row.city,
    state: row.state,
    zipcode: row.zipcode,
    profession: row.profession,
    employer_name: row.employer_name,
  }
}

const apiReprContribution = (row) => {
  return {
    account_code: row.account_code,
    amount: row.amount,
    candidate_referendum_name: row.candidate_referendum_name,
    committee_sboe_id: row.committee_sboe_id,
    contributor_id: row.contributor_id,
    date_occurred: row.date_occurred,
    declaration: row.declaration,
    form_of_payment: row.form_of_payment,
    purpose: row.purpose,
    report_name: row.report_name,
    transaction_type: row.transaction_type,
  }
}

const apiReprCommittee = (row) => {
  return {
    candidate_full_name: row.candidate_full_name,
    committee_name: row.committee_name,
  }
}

const apiReprContributionCommittee = (row) => {
  return {
    ...apiReprContribution(row),
    ...apiReprCommittee(row),
    total_contributions_to_committee: row.total_contributions_to_committee,
  }
}

// the combined view for contributor + contributions
const apiReprContributorContributions = (row) => {
  return {
    ...apiReprContributor(row),
    ...apiReprContribution(row),
  }
}

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
  console.log('filename', sanitize(filename))
  res.setHeader('Content-type', 'text/csv')
  res.setHeader(
    'Content-disposition',
    `attachment; filename="${sanitize(filename)}"`
  )

  const fields = Object.keys(data[0])
  const csv = parse(data, { fields })
  res.send(csv)
}

const api = express.Router()
api.use(express.json())

api.get('/search/contributors/:name', async (req, res) => {
  try {
    const { name } = req.params
    const {
      offset = 0,
      limit = 50,
      sortBy = 'sml',
      name: nameFilter,
      profession,
      cityState,
    } = req.query
    const decodedName = decodeURIComponent(name)

    const contributors = await searchContributors(
      decodedName,
      offset,
      limit,
      TRIGRAM_LIMIT,
      sortBy,
      nameFilter,
      profession,
      cityState
    )
    return res.send({
      data: contributors.data.map(apiReprContributor),
      count: contributors.data.length > 0 ? contributors.data[0].full_count : 0,
    })
  } catch (error) {
    handleError(error, res)
  }
})

api.get('/search/candidates/:name', async (req, res) => {
  try {
    const { name } = req.params
    const {
      offset = 0,
      limit = 50,
      sortBy = 'first_last_sml',
      name: nameFilter,
      party,
      contest,
    } = req.query
    const decodedName = decodeURIComponent(name)

    const committees = await searchCommittees(
      decodedName,
      offset,
      limit,
      TRIGRAM_LIMIT,
      sortBy,
      nameFilter,
      party,
      contest
    )
    return res.send({
      data: committees.data.map(apiReprCandidate),
      count: committees.data.length > 0 ? committees.data[0].full_count : 0,
    })
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
      data:
        candidate.rows.length > 0 ? apiReprCandidate(candidate.rows[0]) : [],
    })
  } catch (error) {
    handleError(error, res)
  } finally {
    if (client !== null) {
      client.release()
    }
  }
})

api.get('/candidate/:ncsbeID/contributions/summary', async (req, res) => {
  try {
    let { ncsbeID = '' } = req.params
    ncsbeID = decodeURIComponent(ncsbeID)
    if (!ncsbeID) {
      res.status(500)
      return res.send({
        error: 'empty ncsbeID',
      })
    }
    const summary = await getCandidateSummary(ncsbeID)
    res.send({
      data: summary,
    })
  } catch (err) {
    handleError(err, res)
  }
})

api.get('/candidate/:ncsbeID/contributions', async (req, res) => {
  let client = null
  try {
    let { ncsbeID = '' } = req.params
    const {
      limit = 50,
      offset = 0,
      toCSV = false,
      sortBy,
      name,
      transaction_type,
      amount,
      form_of_payment,
      date_occurred_gte,
      date_occurred_lte,
    } = req.query
    ncsbeID = decodeURIComponent(ncsbeID)
    if (!ncsbeID) {
      res.status(500)
      return res.send({
        error: 'empty ncsbeID',
      })
    }

    if (!toCSV) {
      const contributions = await getCandidateContributions({
        ncsbeID,
        limit,
        offset,
        sortBy,
        name,
        transaction_type,
        amount,
        form_of_payment,
        date_occurred_gte,
        date_occurred_lte,
      })

      return res.send({
        data: contributions.rows.map(apiReprContributorContributions),
        count:
          contributions.rows.length > 0 ? contributions.rows[0].full_count : 0,
      })
    } else {
      client = await getClient()
      const contributionsPromise = await getCandidateContributionsForDownload({
        ncsbeID,
        client,
      })

      const candidatePromise = await getCandidate(ncsbeID, client)

      const [contributions, candidate] = await Promise.all([
        contributionsPromise,
        candidatePromise,
      ])

      if (contributions.rows.length < 1 || !candidate) {
        return handleError(
          new Error(`no results found for candidate with id: ${ncsbeID}`),
          res
        )
      }

      // Due to some data integrity issues, not all candidates have a full_name field,
      // So we fallback to the committee_name
      const candidateName = candidate.candidate_full_name
        ? candidate.candidate_full_name
        : candidate.committee_name

      sendCSV(
        contributions.rows.map(apiReprContributorContributions),
        `${candidateName.replace(/ /g, '_').toLowerCase()}_contributions.csv`,
        res
      )
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
    const { limit = 50, offset = 0, toCSV = false } = req.query
    client = await getClient()
    if (!toCSV) {
      const contributions = await getContributorContributions({
        client,
        offset,
        limit,
        contributorId,
      })
      return res.send({
        data: contributions.rows.map(apiReprContributionCommittee),
        count:
          contributions.rows.length > 0 ? contributions.rows[0].full_count : 0,
      })
    } else {
      const contributionsPromise = getContributorContributions({
        client,
        contributorId,
      })
      const contributorPromise = getContributor({ contributorId, client })
      const [contributions, contributor] = await Promise.all([
        contributionsPromise,
        contributorPromise,
      ])

      const contributorName =
        contributor.rows.length > 0 ? contributor.rows[0].name : contributorId
      sendCSV(
        contributions.rows.map(apiReprContributionCommittee),
        contributorName.replace(/ /g, '_'),
        res
      )
    }
  } catch (error) {
    handleError(error, res)
  } finally {
    if (client !== null) {
      client.release()
    }
  }
})

api.get('/contributor/:contributorId', async (req, res) => {
  let client = null
  try {
    const { contributorId } = req.params
    client = await getClient()
    const result = await client.query(
      `select * from contributors where id = $1`,
      [contributorId]
    )
    const contributor =
      result.rows.length > 0 ? apiReprContributor(result.rows[0]) : null

    // Return 404 and data = null if the contributor was not found
    res.status(contributor === null ? 404 : 200)
    return res.send({
      data: contributor,
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
      candidates: {
        data: committees.data.map(apiReprCandidate),
        count: committees.data.length > 0 ? committees.data[0].full_count : 0,
      },
      donors: {
        data: donors.data.map(apiReprContributor),
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

module.exports = api
