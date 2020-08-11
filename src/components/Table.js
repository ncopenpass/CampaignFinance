import React from 'react'
import { useTable, useSortBy, useFilters, useGlobalFilter } from 'react-table'
import matchSorter from 'match-sorter'
import Select from 'react-select'
import { Table as USTable } from '@trussworks/react-uswds'
import '../css/table.scss'

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
        setFilter(value.value || undefined)
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

export default function Table({ columns, data, count }) {
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
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
    },
    useFilters,
    useGlobalFilter,
    useSortBy
  )

  return (
    <USTable bordered={true} fullWidth={true} {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                className={
                  column.isSorted
                    ? column.isSortedDesc
                      ? 'sort-desc'
                      : 'sort-asc'
                    : ''
                }
              >
                {column.render('Header')}
                <div className="column-filter">
                  {column.canFilter ? column.render('Filter') : null}
                </div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      {count && (
        <tfoot>
          <tr>
            <td
              colSpan={columns.length}
            >{`Showing ${data.length} of ${count} results`}</td>
          </tr>
        </tfoot>
      )}
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </USTable>
  )
}
