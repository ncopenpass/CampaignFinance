import React, { useEffect } from 'react'
import { useTable, useSortBy, useFilters, useGlobalFilter } from 'react-table'
import matchSorter from 'match-sorter'
import Select from 'react-select'
import { Table as USTable } from '@trussworks/react-uswds'

import '../css/table.scss'
import SortAscending from '../static/ascending.png'
import SortDescending from '../static/descending.png'
import SortUnsorted from '../static/unsorted.png'

import Spinner from './Spinner'

// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = []
    preFilteredRows.forEach((row) => {
      options.push({ value: row.values[id], label: row.values[id] })
    })
    return options
  }, [id, preFilteredRows])

  // Render a multi-select box
  return (
    <Select
      onChange={(value, action) => {
        setFilter(value?.value || undefined)
      }}
      isMulti={true}
      options={options}
    />
  )
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val

export default function Table({
  columns,
  data,
  onChangeSort,
  initialSortBy,
  isLoading = false,
}) {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    []
  )

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: SelectColumnFilter,
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
    state: { sortBy }, // track the current sort state so we can call appropriate callbacks
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      initialState: initialSortBy ? { sortBy: initialSortBy } : undefined,
      disableMultiSort: true,
      manualSortBy: true,
    },
    useFilters,
    useGlobalFilter,
    useSortBy
  )

  useEffect(() => {
    if (onChangeSort) {
      onChangeSort(sortBy)
    }
  }, [onChangeSort, sortBy])

  return (
    <USTable bordered={true} fullWidth={true} {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                <div>
                  {column.render('Header')}
                  {column.isSortedDesc === true && (
                    <img
                      src={SortDescending}
                      alt="Descending"
                      style={{ verticalAlign: 'middle', marginLeft: '10px' }}
                      height="20px"
                      width="20px"
                    />
                  )}
                  {column.isSortedDesc === false && (
                    <img
                      src={SortAscending}
                      alt="Ascending"
                      style={{ verticalAlign: 'middle', marginLeft: '10px' }}
                      height="20px"
                      width="20px"
                    />
                  )}
                  {column.canSort && column.isSortedDesc === undefined && (
                    <img
                      src={SortUnsorted}
                      alt="Unsorted"
                      style={{ verticalAlign: 'middle', marginLeft: '10px' }}
                      height="20px"
                      width="20px"
                    />
                  )}
                </div>
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
