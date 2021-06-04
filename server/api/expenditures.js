const express = require('express')
const db = require('../db')
const { apiReprExpenditure, apiReprContribution } = require('../lib/repr')
const { getExpenditures, getCommitteeContributions } = require('../lib/queries')
const { handleError, sendCSV } = require('../lib/helpers')

const router = express()

router.get('/expenditures/:ncsbeID', async (req, res) => {
  try {
    const { ncsbeID } = req.params
    const { limit = 50, offset = 0, sortBy } = req.query

    const expenditures = await getExpenditures({
      ncsbeID,
      limit,
      offset,
      sortBy,
    })

    res.send({
      data: expenditures.rows.map(apiReprExpenditure),
      count: expenditures.rows.length > 0 ? expenditures.rows[0].full_count : 0,
    })
  } catch (error) {
    handleError(error, res)
  }
})

module.exports = router
