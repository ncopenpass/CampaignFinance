import express, { Request, Response } from 'express'
import * as db from '../db'
import { apiReprCandidate, apiReprContributorContributions } from '../lib/repr'
import { handleError, streamFile } from '../lib/helpers'
import {
  getCandidate,
  getCandidateSummary,
  getCandidateContributions,
  getCandidateContributionsForDownload,
  getCandidateContributionYears,
} from '../lib/queries'

const router = express.Router()

type CandidateParams = {
  ncsbeID: string
}

router.get(
  '/candidate/:ncsbeID',
  async (req: Request<CandidateParams, {}, {}, {}>, res: Response) => {
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
      handleError(error as Error, res)
    }
  }
)

router.get(
  '/candidate/:ncsbeID/contributions/summary',
  async (
    req: Request<
      CandidateParams,
      {},
      {},
      {
        date_occurred_gte: string
        date_occurred_lte: string
      }
    >,
    res
  ) => {
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
      handleError(err as Error, res)
    }
  }
)

router.get(
  '/candidate/:ncsbeID/contributions',
  async (
    req: Request<
      CandidateParams,
      {},
      {},
      {
        limit: number
        offset: number
        toCSV: boolean
        sortBy: string
        name: string
        transaction_type: string
        amount: number
        amount_lte: number
        amount_gte: number
        form_of_payment: string
        date_occurred_gte: string
        date_occurred_lte: string
        year: string
      }
    >,
    res: Response
  ) => {
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
            contributions.rows.length > 0
              ? contributions.rows[0].full_count
              : 0,
        })
      } else {
        const candidate = await getCandidate(ncsbeID)
        const filename = candidate.candidate_full_name
          ? candidate.candidate_full_name
          : candidate.committee_name

        await streamFile(
          () =>
            getCandidateContributionsForDownload({
              ncsbeID,
              year,
              res,
            }),
          filename,
          res
        )
      }
    } catch (error) {
      handleError(error as Error, res)
    }
  }
)

router.get(
  '/candidate/:ncsbeID/contributions/years',
  async (req: Request<CandidateParams, {}, {}, {}>, res: Response) => {
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
      handleError(error as Error, res)
    }
  }
)
module.exports = router
