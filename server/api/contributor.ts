import express, { Request, Response } from 'express'
import * as db from '../db'
import { apiReprContributionCommittee, apiReprContributor } from '../lib/repr'
import {
  getContributor,
  getContributorContributions,
  getContributorContributionYears,
} from '../lib/queries'
import { handleError, sendCSV } from '../lib/helpers'

const router = express()

type ContributorParams = {
  contributorId: string
}

router.get(
  '/contributor/:contributorId/contributions',
  async (
    req: Request<
      ContributorParams,
      {},
      {},
      {
        limit: number
        offset: number
        toCSV: boolean
        date_occurred_gte?: string
        date_occurred_lte?: string
        year?: string
        sortBy?: string
      }
    >,
    res: Response
  ) => {
    try {
      const { contributorId } = req.params
      const {
        limit = 50,
        offset = 0,
        toCSV = false,
        date_occurred_gte,
        date_occurred_lte,
        year,
        sortBy,
      } = req.query

      if (!toCSV) {
        const contributions = await getContributorContributions({
          offset,
          limit,
          contributorId,
          sortBy,
          date_occurred_gte,
          date_occurred_lte,
          year,
        })
        return res.send({
          data: contributions.rows.map(apiReprContributionCommittee),
          count:
            contributions.rows.length > 0
              ? contributions.rows[0].full_count
              : 0,
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
      handleError(error as Error, res)
    }
  }
)

router.get(
  '/contributor/:contributorId',
  async (req: Request<ContributorParams, {}, {}, {}>, res: Response) => {
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
      handleError(error as Error, res)
    }
  }
)

router.get(
  '/contributor/:ncsbeID/contributions/years',
  async (req: Request<{ ncsbeID: string }, {}, {}, {}>, res: Response) => {
    try {
      let { ncsbeID = '' } = req.params
      ncsbeID = decodeURIComponent(ncsbeID)
      if (!ncsbeID) {
        res.status(500)
        return res.send({
          error: 'empty ncsbeID',
        })
      }

      const years = await getContributorContributionYears({ ncsbeID })

      return res.send({
        data: { years },
        count: years.length, // a little silly,
      })
    } catch (error) {
      handleError(error as Error, res)
    }
  }
)

module.exports = router
