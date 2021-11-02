const express = require('express')
const db = require('../db')
const { apiReprExpenditure } = require('../lib/repr')
const {
  getExpenditures,
  getExpendituresForDownload,
} = require('../lib/queries')
const { handleError, sendCSV } = require('../lib/helpers')

const router = express()

router.get('/expenditures/:ncsbeID', async (req, res) => {
  try {
    const { ncsbeID } = req.params
    const {
      limit = 50,
      offset = 0,
      toCSV = false,
      sortBy,
      date_occurred_gte,
      date_occurred_lte,
    } = req.query

    if (!toCSV) {
      const expenditures = await getExpenditures({
        ncsbeID,
        limit,
        offset,
        sortBy,
        date_occurred_gte,
        date_occurred_lte,
      })

      res.send({
        data: expenditures.rows.map(apiReprExpenditure),
        count:
          expenditures.rows.length > 0 ? expenditures.rows[0].full_count : 0,
      })
    } else {
      const [expenditures, candidate] = await Promise.all([
        getExpendituresForDownload({
          ncsbeID,
          date_occurred_gte,
          date_occurred_lte,
        }),
        getExpenditures(ncsbeID),
      ])

      if (expenditures.rows.length < 1 || !candidate) {
        return handleError(
          new Error(`no results found for candidate with id: ${ncsbeID}`),
          res
        )
      }

      sendCSV(
        expenditures.rows.map(apiReprExpenditure),
        `${ncsbeID}_expenditures.csv`,
        res
      )
    }
  } catch (error) {
    handleError(error, res)
  }
})

module.exports = router
