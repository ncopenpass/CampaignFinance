import React, { useEffect, useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Grid, GridContainer } from '@trussworks/react-uswds'

import {
  useContributors,
  useGetContributorContributionYears,
} from '../hooks/useContributors'
import SearchResultTable from './SearchResultTable'
import { useTableColumns } from '../hooks'
import { API_BATCH_SIZE, STATUSES } from '../constants'
import ReportError from './ReportError'
import { formatSortBy } from '../utils'
import DateRange from './DateRange'

import '../css/candidate.scss'

const Contributor = () => {
  let { contributorId } = useParams()

  // Initialize dates to current year
  const date = new Date()
  const currentDate = date.toISOString().split('T')[0]
  const currentYear = date.getFullYear().toString()
  const [datePickerStart, setDatePickerStart] = useState(currentYear + '-01-01')
  const [datePickerEnd, setDatePickerEnd] = useState(currentDate)

  const { years, status: yearsStatus } =
    useGetContributorContributionYears(contributorId)

  useEffect(() => {
    if (years && years.length > 0 && yearsStatus === STATUSES.Success) {
      setDatePickerStart(years[years.length - 1] + '-01-01')
      setDatePickerEnd(years[0] + '-12-31')
    }
  }, [years, yearsStatus])

  const {
    contributor,
    apiStatus,
    contributions,
    contributionCount,
    contributionOffset,
    fetchInitialSearchData,
    fetchContributorContributions,
  } = useContributors()

  const [query, setQuery] = useState({
    contributorId,
    limit: API_BATCH_SIZE,
    offset: 0,
    sort: '-date_occurred',
  })

  useEffect(() => {
    if (fetchInitialSearchData) {
      fetchInitialSearchData({
        contributorId,
        limit: API_BATCH_SIZE,
        offset: 0,
        sort: '-date_occurred',
        filters: [
          { date_occurred_gte: datePickerStart },
          { date_occurred_lte: datePickerEnd },
        ],
      })
    }
  }, [contributorId, fetchInitialSearchData, datePickerStart, datePickerEnd])

  const handleFetchContributions = useCallback(
    ({ sortBy }) => {
      const sort = formatSortBy(sortBy)
      if (sort !== query.sort) {
        const q = { ...query, sort }
        setQuery(q)
        fetchContributorContributions(q)
      }
    },
    [fetchContributorContributions, query]
  )

  const fetchSameContributions = useCallback(
    (limit = API_BATCH_SIZE) => {
      const q = { ...query, limit }
      setQuery(q)
      fetchContributorContributions(q)
    },
    [fetchContributorContributions, query]
  )

  const fetchNextContributions = useCallback(
    (limit = API_BATCH_SIZE) => {
      const q = { ...query, offset: query.offset + limit }
      setQuery(q)
      fetchContributorContributions(q)
    },
    [fetchContributorContributions, query]
  )

  const fetchPreviousContributions = useCallback(
    (limit = API_BATCH_SIZE) => {
      const q = { ...query, offset: query.offset - limit }
      setQuery(q)
      fetchContributorContributions(q)
    },
    [fetchContributorContributions, query]
  )

  const { individualContributionsColumns } = useTableColumns()

  return (
    <div className="container">
      <GridContainer>
        <Grid row>
          <Grid col>
            <p className="contributor-label">CONTRIBUTOR</p>
          </Grid>
        </Grid>
        <Grid row>
          <Grid col>
            <h1 className="candidate-name">{contributor.name}</h1>
            <p className="candidate-prop">
              <span className="candidate-prop-label">Job Title:</span>
              {contributor.profession}
            </p>
            <p className="candidate-prop">
              <span className="candidate-prop-label">Employer:</span>
              {contributor.employer_name}
            </p>
            <p className="candidate-prop">
              <span className="candidate-prop-label">City/State:</span>
              {`${contributor.city}, ${contributor.state}`}
            </p>
          </Grid>
        </Grid>

        {yearsStatus === STATUSES.Success && (
          <DateRange
            datePickerStart={datePickerStart}
            datePickerEnd={datePickerEnd}
            setDatePickerStart={setDatePickerStart}
            setDatePickerEnd={setDatePickerEnd}
            allYears={years}
          />
        )}

        <Grid row gap="sm">
          <Grid col={7} mobile={{ col: 6 }}>
            <p className="table-label">Contributions</p>
          </Grid>
          <Grid col={5} mobile={{ col: 6 }}>
            <ReportError />
            <a
              href={`${
                process.env.NODE_ENV === 'production'
                  ? ''
                  : 'http://localhost:3001'
              }/api/contributor/${contributorId}/contributions?toCSV=true&date_occurred_gte=${datePickerStart}&date_occurred_lte=${datePickerEnd}`}
            >
              <Button
                className="csv-download-button"
                disabled={contributionCount === 0}
              >
                Download Results
              </Button>
            </a>
          </Grid>
        </Grid>
        <Grid row>
          <Grid col>
            <SearchResultTable
              columns={individualContributionsColumns}
              apiStatus={apiStatus}
              data={contributions}
              count={contributionCount}
              fetchSame={fetchSameContributions}
              fetchNext={fetchNextContributions}
              fetchPrevious={fetchPreviousContributions}
              offset={contributionOffset}
              searchTerm={contributor.name}
              searchType="contributions"
              onFetchData={handleFetchContributions}
              initialSortBy={[{ id: 'date_occurred', desc: true }]}
            />
          </Grid>
        </Grid>
      </GridContainer>
    </div>
  )
}

export default Contributor
