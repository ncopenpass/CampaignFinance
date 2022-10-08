import express, { Request, Response } from 'express'
import {
  searchContributors,
  searchCommittees,
  searchCandidates,
} from '../lib/search'
import {
  apiReprContributor,
  apiReprCandidate,
  apiReprCommittee,
} from '../lib/repr'
import { handleError } from '../lib/helpers'
import { assert } from 'console'
import { StandardResponse } from '../types'
const router = express.Router()

const TRIGRAM_LIMIT = 0.6

type CommonQueryParams = {
  offset: number
  limit: number
  sortBy: string
  name: string
}

type ContributorsQueryParams = CommonQueryParams & {
  profession?: string
  cityState?: string
}

router.get(
  '/search/contributors/:name',
  async (
    req: Request<
      { name: string },
      StandardResponse,
      {},
      ContributorsQueryParams
    >,
    res: Response
  ) => {
    try {
      const { name } = req.params
      const {
        offset = 0,
        limit = 50,
        sortBy = 'sml',
        name: nameFilter,
        profession,
        cityState,
      } = req.query

      const decodedName = decodeURIComponent(name)

      const contributors = await searchContributors(
        decodedName,
        offset,
        limit,
        TRIGRAM_LIMIT,
        sortBy,
        nameFilter,
        profession,
        cityState
      )
      return res.send({
        data: contributors.data.map(apiReprContributor),
        count:
          contributors.data.length > 0 ? contributors.data[0].full_count : 0,
      })
    } catch (error) {
      handleError(error as Error, res)
    }
  }
)

type CandidatesQueryParams = CommonQueryParams & {
  party: string
  contest: string
}

router.get(
  '/search/candidates/:name',
  async (
    req: Request<{ name: string }, StandardResponse, {}, CandidatesQueryParams>,
    res: Response
  ) => {
    try {
      const { name } = req.params
      const {
        offset = 0,
        limit = 50,
        sortBy = 'first_last_sml',
        name: nameFilter,
        party,
        contest,
      } = req.query
      const decodedName = decodeURIComponent(name)

      const committees = await searchCandidates(
        decodedName,
        offset,
        limit,
        TRIGRAM_LIMIT,
        sortBy,
        nameFilter,
        party,
        contest
      )
      return res.send({
        data: committees.data.map(apiReprCandidate),
        count: committees.data.length > 0 ? committees.data[0].full_count : 0,
      })
    } catch (error) {
      handleError(error as Error, res)
    }
  }
)

type CommitteeSearchQueryParams = CandidatesQueryParams

router.get(
  '/search/committees/:name',
  async (
    req: Request<
      { name: string },
      StandardResponse,
      {},
      CommitteeSearchQueryParams
    >,
    res: Response
  ) => {
    try {
      let { name } = req.params
      name = decodeURIComponent(name)
      const {
        offset = 0,
        limit = 50,
        sortBy,
        name: nameFilter = '',
        party = '',
        contest = '',
      } = req.query

      const committees = await searchCommittees({
        name,
        offset,
        limit,
        trigramLimit: TRIGRAM_LIMIT,
        sort: sortBy,
        nameFilter,
        partyFilter: party,
        contestFilter: contest,
      })
      return res.send({
        data: committees.data.map(apiReprCommittee),
        count: committees.data.length > 0 ? committees.data[0].full_count : 0,
      })
    } catch (error) {
      handleError(error as Error, res)
    }
  }
)

module.exports = router
