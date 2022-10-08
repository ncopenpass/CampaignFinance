import express, { Response, Request } from 'express'
import { apiReprExpenditure } from '../lib/repr'
import {
  getExpenditures,
  getExpendituresForDownload,
  getCandidate,
} from '../lib/queries'
import { handleError, streamFile } from '../lib/helpers'

const router = express()

router.get(
  '/expenditures/:ncsbeID',
  async (
    req: Request<
      { ncsbeID: string },
      {},
      {},
      {
        limit: number
        offset: number
        toCSV: boolean
        sortBy?: string
        date_occurred_gte?: string
        date_occurred_lte?: string
        year?: string
      }
    >,
    res: Response
  ) => {
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
      handleError(error as Error, res)
    }
  }
)

module.exports = router
