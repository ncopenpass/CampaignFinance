import React, { useEffect, useMemo, useCallback } from 'react'
import { useParams, useLocation } from 'react-router'
import { GridContainer, Alert, Accordion } from '@trussworks/react-uswds'
import styled from '@emotion/styled'

import { useSearch, useTableColumns } from '../hooks'
import { API_BATCH_SIZE } from '../constants'

import SearchBar from './SearchBar'
import SearchResultTable from './SearchResultTable'

const SearchBarContainer = styled.div`
  padding: 20px 0px;
`
const SearchResults = React.memo(() => {
  let { searchTerm } = useParams()
  let location = useLocation()
  let quickSearchParam
  if (location.state !== undefined) {
    quickSearchParam = location.state.candidateQuickSearch
  }

  const {
    hasError,
    donors,
    candidates,
    donorCount,
    candidateCount,
    donorOffset,
    candidateOffset,
    fetchCandidates,
    fetchDonors,
    fetchInitialSearchData,
    fetchQuickCandidates,
  } = useSearch()
  const { donorColumns, candidateColumns } = useTableColumns()

  useEffect(() => {
    if (fetchInitialSearchData) {
      fetchInitialSearchData({ searchTerm })
    }
  }, [searchTerm, fetchInitialSearchData])

  const fetchNextCandidates = useCallback(() => {
    fetchCandidates({
      searchTerm,
      offset: candidateOffset + API_BATCH_SIZE,
    })
  }, [candidateOffset, fetchCandidates, searchTerm])

  const fetchPreviousCandidates = useCallback(() => {
    fetchCandidates({
      searchTerm,
      offset: candidateOffset - API_BATCH_SIZE,
    })
  }, [candidateOffset, searchTerm, fetchCandidates])

  const quickCandidates = useCallback(() => {
    fetchQuickCandidates({
      searchTerm,
      offset: candidateOffset + API_BATCH_SIZE,
    })
  }, [candidateOffset, fetchQuickCandidates, searchTerm])

  const fetchNextDonors = useCallback(() => {
    fetchDonors({
      searchTerm,
      offset: donorOffset + API_BATCH_SIZE,
    })
  }, [donorOffset, fetchDonors, searchTerm])

  const fetchPreviousDonors = useCallback(() => {
    fetchDonors({
      searchTerm,
      offset: donorOffset - API_BATCH_SIZE,
    })
  }, [donorOffset, searchTerm, fetchDonors])

  let resultsTables

  if (quickSearchParam) {
    resultsTables = useMemo(
      () => [
        {
          title: `Candidates (${candidateCount}) matching "${searchTerm}"`,
          content: (
            <SearchResultTable
              columns={candidateColumns}
              data={candidates}
              count={candidateCount}
              offset={candidateOffset}
              fetchNext={quickCandidates}
              //fetchPrevious={fetchPreviousCandidates}
              searchTerm={searchTerm}
              searchType="candidates"
            />
          ),
          expanded: true,
          id: 'candidates',
        },
      ],
      [
        candidateColumns,
        candidates,
        candidateCount,
        candidateOffset,
        searchTerm,
        quickCandidates,
        //fetchNextCandidates,
        //fetchPreviousCandidates,
      ]
    )
  } else {
    resultsTables = useMemo(
      () => [
        {
          title: `Candidates (${candidateCount}) matching "${searchTerm}"`,
          content: (
            <SearchResultTable
              columns={candidateColumns}
              data={candidates}
              count={candidateCount}
              offset={candidateOffset}
              fetchNext={fetchNextCandidates}
              fetchPrevious={fetchPreviousCandidates}
              searchTerm={searchTerm}
              searchType="candidates"
            />
          ),
          expanded: true,
          id: 'candidates',
        },
        {
          title: `Donors (${donorCount}) matching "${searchTerm}"`,
          content: (
            <SearchResultTable
              columns={donorColumns}
              data={donors}
              count={donorCount}
              offset={donorOffset}
              fetchNext={fetchNextDonors}
              fetchPrevious={fetchPreviousDonors}
              searchTerm={searchTerm}
              searchType="donors"
            />
          ),
          expanded: true,
          id: 'donors',
        },
      ],
      [
        candidateColumns,
        candidates,
        candidateCount,
        candidateOffset,
        donorColumns,
        donors,
        donorCount,
        donorOffset,
        searchTerm,
        fetchNextCandidates,
        fetchPreviousCandidates,
        fetchNextDonors,
        fetchPreviousDonors,
      ]
    )
  }
  return (
    <GridContainer>
      {hasError ? (
        <Alert slim type="error">
          Error fetching search data
        </Alert>
      ) : (
        <>
          <SearchBarContainer>
            <SearchBar hideQuickLinks />
          </SearchBarContainer>
          <Accordion items={resultsTables} />
        </>
      )}
    </GridContainer>
  )
})

export default SearchResults
