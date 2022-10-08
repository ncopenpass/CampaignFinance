const express = require('express')
const { apiReprExpenditure } = require('../lib/repr')
const {
  getExpenditures,
  getExpendituresForDownload,
  getCandidate,
} = require('../lib/queries')
const { handleError, streamFile } = require('../lib/helpers')

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
      year,
    } = req.query

    if (!toCSV) {
      const expenditures = await getExpenditures({
        ncsbeID,
        limit,
        offset,
        sortBy,
        date_occurred_gte,
        date_occurred_lte,
        year,
      })

      res.send({
        data: expenditures.rows.map(apiReprExpenditure),
        count:
          expenditures.rows.length > 0 ? expenditures.rows[0].full_count : 0,
      })
    } else {
      const [candidate] = await Promise.all([getCandidate(ncsbeID)])

      if (!candidate) {
        return handleError(
          new Error(`no results found for candidate with id: ${ncsbeID}`),
          res
        )
      }

      await streamFile(
        () =>
          getExpendituresForDownload({
            ncsbeID,
            date_occurred_gte,
            date_occurred_lte,
            year,
            res,
          }),
        `${ncsbeID}_expenditures.csv`,
        res
      )
    }
  } catch (error) {
    handleError(error, res)
  }
})

module.exports = router
