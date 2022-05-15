const express = require('express')
const db = require('../db')
const {
  apiReprCandidate,
  apiReprContributorContributions,
} = require('../lib/repr')
const { handleError, sendCSV } = require('../lib/helpers')
const {
  getCandidate,
  getCandidateSummary,
  getCandidateContributions,
  getCandidateContributionsForDownload,
  getCandidateContributionYears,
} = require('../lib/queries')

const router = express.Router()

router.get('/candidate/:ncsbeID', async (req, res) => {
  try {
    let { ncsbeID = '' } = req.params
    ncsbeID = decodeURIComponent(ncsbeID)
    if (!ncsbeID) {
      res.status(500)
      return res.send({
        error: 'empty ncsbeID',
      })
    }

    const candidate = await db.query(
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
  }
})

router.get('/candidate/:ncsbeID/contributions/summary', async (req, res) => {
  try {
    let { ncsbeID = '' } = req.params
    const { date_occurred_gte, date_occurred_lte } = req.query
    ncsbeID = decodeURIComponent(ncsbeID)
    if (!ncsbeID) {
      res.status(500)
      return res.send({
        error: 'empty ncsbeID',
      })
    }
    const summary = await getCandidateSummary({
      ncsbeID,
      date_occurred_gte,
      date_occurred_lte,
    })
    res.send({
      data: summary,
    })
  } catch (err) {
    handleError(err, res)
  }
})

router.get('/candidate/:ncsbeID/contributions', async (req, res) => {
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
      amount_lte,
      amount_gte,
      form_of_payment,
      date_occurred_gte,
      date_occurred_lte,
      year,
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
        amount_lte,
        amount_gte,
        form_of_payment,
        date_occurred_gte,
        date_occurred_lte,
        year,
      })

      return res.send({
        data: contributions.rows.map(apiReprContributorContributions),
        count:
          contributions.rows.length > 0 ? contributions.rows[0].full_count : 0,
      })
    } else {
      const [contributions, candidate] = await Promise.all([
        getCandidateContributionsForDownload({
          ncsbeID,
          date_occurred_gte,
          date_occurred_lte,
          year,
        }),
        getCandidate(ncsbeID),
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
  }
})

router.get('/candidate/:ncsbeID/contributions/years', async (req, res) => {
  try {
    let { ncsbeID = '' } = req.params
    ncsbeID = decodeURIComponent(ncsbeID)
    if (!ncsbeID) {
      res.status(500)
      return res.send({
        error: 'empty ncsbeID',
      })
    }

    const years = await getCandidateContributionYears({ ncsbeID })

    return res.send({
      data: { years },
      count: years.length, // a little silly,
    })
  } catch (error) {
    handleError(error, res)
  }
})
module.exports = router
