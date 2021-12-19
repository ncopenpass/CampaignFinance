const express = require('express')
const db = require('../db')
const {
  apiReprCommittee,
  apiReprContributorContributions,
} = require('../lib/repr')

const { handleError, sendCSV } = require('../lib/helpers')

const {
  getCommittee,
  getCommitteeSummary,
  getCommitteeContributions,
  getCommitteeContributionsForDownload,
} = require('../lib/queries')

const router = express.Router()

router.get('/committee/:ncsbeID', async (req, res) => {
  try {
    let { ncsbeID = '' } = req.params
    ncsbeID = decodeURIComponent(ncsbeID)
    if (!ncsbeID) {
      res.status(500)
      return res.send({
        error: 'empty ncsbeID',
      })
    }

    const committee = await db.query(
      `select * from committees
            where upper(committees.sboe_id) = upper($1)`,
      [ncsbeID]
    )
    return res.send({
      data:
        committee.rows.length > 0 ? apiReprCommittee(committee.rows[0]) : [],
    })
  } catch (error) {
    handleError(error, res)
  }
})

router.get('/committee/:ncsbeID/contributions/summary', async (req, res) => {
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
    const summary = await getCommitteeSummary({
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

router.get('/committee/:ncsbeID/contributions', async (req, res) => {
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
      const contributions = await getCommitteeContributions({
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
        year,
      })

      return res.send({
        data: contributions.rows.map(apiReprContributorContributions),
        count:
          contributions.rows.length > 0 ? contributions.rows[0].full_count : 0,
      })
    } else {
      const [contributions, committee] = await Promise.all([
        getCommitteeContributionsForDownload({
          ncsbeID,
          date_occurred_gte,
          date_occurred_lte,
          year,
        }),
        getCommittee(ncsbeID),
      ])

      if (contributions.rows.length < 1 || !committee) {
        return handleError(
          new Error(`no results found for candidate with id: ${ncsbeID}`),
          res
        )
      }

      const committeeName = committee.committee_name

      sendCSV(
        contributions.rows.map(apiReprContributorContributions),
        `${committeeName.replace(/ /g, '_').toLowerCase()}_contributions.csv`,
        res
      )
    }
  } catch (error) {
    handleError(error, res)
  }
})

module.exports = router
