const express = require('express')
const db = require('../db')
const {
  apiReprContributionCommittee,
  apiReprContributor,
} = require('../lib/repr')
const {
  getContributor,
  getContributorContributions,
} = require('../lib/queries')
const { handleError, sendCSV } = require('../lib/helpers')

const router = express()

router.get('/contributor/:contributorId/contributions', async (req, res) => {
  try {
    const { contributorId } = req.params
    const {
      limit = 50,
      offset = 0,
      toCSV = false,
      date_occurred_gte,
      date_occurred_lte,
      year,
    } = req.query
    if (!toCSV) {
      const contributions = await getContributorContributions({
        offset,
        limit,
        contributorId,
        date_occurred_gte,
        date_occurred_lte,
        year,
      })
      return res.send({
        data: contributions.rows.map(apiReprContributionCommittee),
        count:
          contributions.rows.length > 0 ? contributions.rows[0].full_count : 0,
      })
    } else {
      const contributionsPromise = getContributorContributions({
        contributorId,
        date_occurred_gte,
        date_occurred_lte,
        year,
      })
      const contributorPromise = getContributor({ contributorId })

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
  }
})

router.get('/contributor/:contributorId', async (req, res) => {
  try {
    const { contributorId } = req.params
    const result = await db.query(
      `select * from contributors where account_id = $1`,
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
  }
})

module.exports = router
