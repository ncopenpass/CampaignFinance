const express = require('express')
const {
  searchContributors,
  searchCommittees,
  searchCandidates,
} = require('../lib/search')
const {
  apiReprContributor,
  apiReprCandidate,
  apiReprCommittee,
} = require('../lib/repr')
const { handleError } = require('../lib/helpers')
const router = express.Router()

const TRIGRAM_LIMIT = 0.6

router.get('/search/contributors/:name', async (req, res) => {
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
      count: contributors.data.length > 0 ? contributors.data[0].full_count : 0,
    })
  } catch (error) {
    handleError(error, res)
  }
})

router.get('/search/candidates/:name', async (req, res) => {
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
    handleError(error, res)
  }
})

router.get('/search/committees/:name', async (req, res) => {
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
    handleError(error, res)
  }
})

router.get('/search/candidates-donors-pacs/:name', async (req, res) => {
  try {
    const { name } = req.params
    const { limit = 50 } = req.query
    const decodedName = decodeURIComponent(name)

    const committees = await searchCommittees(
      decodedName,
      0,
      limit,
      TRIGRAM_LIMIT
    )
    const donors = await searchContributors(
      decodedName,
      0,
      limit,
      TRIGRAM_LIMIT
    )

    return res.send({
      candidates: {
        data: committees.data.map(apiReprCandidate),
        count: committees.data.length > 0 ? committees.data[0].full_count : 0,
      },
      donors: {
        data: donors.data.map(apiReprContributor),
        count: donors.data.length > 0 ? donors.data[0].full_count : 0,
      },
      // this is placeholder until we include real pacs data
      pacs: {
        data: [],
        count: '0',
      },
    })
  } catch (error) {
    handleError(error, res)
  }
})

module.exports = router
