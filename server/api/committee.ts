import express, { Request, Response } from 'express'
import * as db from '../db'
import { apiReprCommittee, apiReprContributorContributions } from '../lib/repr'
import { handleError, streamFile } from '../lib/helpers'

import {
  getCommittee,
  getCommitteeSummary,
  getCommitteeContributions,
  getCommitteeContributionsForDownload,
  getCandidateContributionYears,
} from '../lib/queries'

const router = express.Router()

type CommitteeParams = {
  ncsbeID: string
}

router.get(
  '/committee/:ncsbeID',
  async (req: Request<CommitteeParams, {}, {}, {}>, res: Response) => {
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
      handleError(error as Error, res)
    }
  }
)

router.get(
  '/committee/:ncsbeID/contributions/summary',
  async (
    req: Request<
      CommitteeParams,
      {},
      {},
      { date_occurred_gte?: string; date_occurred_lte?: string }
    >,
    res: Response
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
      const summary = await getCommitteeSummary({
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
  '/committee/:ncsbeID/contributions',
  async (
    req: Request<
      CommitteeParams,
      {},
      {},
      {
        limit: Number
        offset: Number
        sortBy: string
        name?: string
        transaction_type?: string
        amount?: number
        form_of_payment?: string
        date_occurred_gte?: string
        date_occurred_lte?: string
        year?: string
        toCSV: boolean
      }
    >,
    res
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
            contributions.rows.length > 0
              ? contributions.rows[0].full_count
              : 0,
        })
      } else {
        const committee = await getCommittee(ncsbeID)

        if (!committee) {
          return handleError(
            new Error(`no results found for candidate with id: ${ncsbeID}`),
            res
          )
        }

        const committeeName = committee.committee_name

        await streamFile(
          () =>
            getCommitteeContributionsForDownload({
              ncsbeID,
              date_occurred_gte,
              date_occurred_lte,
              year,
              res,
            }),
          `${committeeName.replace(/ /g, '_').toLowerCase()}_contributions.csv`,
          res
        )
      }
    } catch (error) {
      handleError(error as Error, res)
    }
  }
)

router.get(
  '/committee/:ncsbeID/contributions/years',
  async (req: Request, res: Response) => {
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
