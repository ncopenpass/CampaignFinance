import React, { useEffect } from 'react'
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
} from 'react-table'
import matchSorter from 'match-sorter'
import { Table as USTable } from '@trussworks/react-uswds'

import '../css/table.scss'
import SortAscending from '../static/ascending.png'
import SortDescending from '../static/descending.png'
import SortUnsorted from '../static/unsorted.png'

import Spinner from './Spinner'
function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val

export default function Table({
  columns,
  data,
  onFetchData,
  initialSortBy,
  isLoading = false,
}) {
  const defaultColumn = React.useMemo(
    () => ({
      disableFilters: true,
      disableSortBy: true,
    }),
    []
  )

  // Use the useTable Hook to send the columns and data to build the table
  const {
    getTableProps, // table props from react-table
    getTableBodyProps, // table body props from react-table
    headerGroups, // headerGroups, if your table has groupings
    rows, // rows for the table based on the data passed
    prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
    state: { sortBy, filters }, // track the current sort and filter state so we can call appropriate callbacks
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: initialSortBy ? { sortBy: initialSortBy } : undefined,
      disableMultiSort: true,
      manualSortBy: true,
      manualFilters: true,
    },
    useFilters,
    useGlobalFilter,
    useSortBy
  )

  // 250ms debounce
  const onFetchDataDebounced = useAsyncDebounce(onFetchData, 250)

  useEffect(() => {
    if (onFetchData) {
      onFetchDataDebounced({ filters, sortBy })
    }
  }, [onFetchData, onFetchDataDebounced, filters, sortBy])

  return (
    <USTable bordered={true} fullWidth={true} {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>
                <div {...column.getSortByToggleProps()}>
                  {column.render('Header')}
                  {column.isSortedDesc === true && (
                    <img
                      src={SortDescending}
                      alt="Descending"
                      style={{
                        verticalAlign: 'middle',
                        marginLeft: '2px',
                        position: 'absolute',
                        marginTop: '4px',
                      }}
                      height="18px"
                      width="18px"
                    />
                  )}
                  {column.isSortedDesc === false && (
                    <img
                      src={SortAscending}
                      alt="Ascending"
                      style={{
                        verticalAlign: 'middle',
                        marginLeft: '2px',
                        position: 'absolute',
                        marginTop: '4px',
                      }}
                      height="18px"
                      width="18px"
                    />
                  )}
                  {column.canSort && column.isSortedDesc === undefined && (
                    <img
                      src={SortUnsorted}
                      alt="Unsorted"
                      style={{
                        verticalAlign: 'middle',
                        marginLeft: '2px',
                        position: 'absolute',
                        marginTop: '4px',
                      }}
                      height="18px"
                      width="18px"
                    />
                  )}
                </div>
                <div>{column.canFilter && column.render('Filter')}</div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {isLoading ? (
          <tr>
            <td colSpan={columns.length}>
              <Spinner />
            </td>
          </tr>
        ) : (
          <>
            {rows.map((row, i) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    )
                  })}
                </tr>
              )
            })}
          </>
        )}
      </tbody>
    </USTable>
  )
}
