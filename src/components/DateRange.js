import React, { useState } from 'react'
import {
  NavDropDownButton,
  DateRangePicker,
  Dropdown,
  Fieldset,
} from '@trussworks/react-uswds'
import '../css/date.scss'

/**
 * - The component filters search data by the dates selected in the Date Range Picker
 * - There is a Year Selector dropdown for quick filtering to a specific year
 * - All Years filters to all of the data from the first date of the oldest year to the current date
 * - Changing the Year Selector updates the dates in the Date Range Picker
 * - State from the date range picker queries the database to return the requested dates
 */

// Helper function to generate array of years for year selector
function getYears() {
  // FIXME: remove hard-coded oldest year and update with database query
  const oldestYear = '2011'
  const currentYear = new Date().getFullYear()
  return Array(currentYear - (oldestYear - 1))
    .fill('')
    .map((_, i) => currentYear - i)
}

function DateRange({
  datePickerStart,
  datePickerEnd,
  setDatePickerStart,
  setDatePickerEnd,
  allYears = getYears(),
}) {
  /** State for expanding the custom date picker */
  const [isCustomDatesOpen, setCustomDatesOpen] = useState(false)

  /**
   * Helper function to set the date range to All Years
   * Set start date to the first day of the oldest data year
   * Set the end date to the current date
   */
  function setAllYears() {
    const currentDate = new Date().toISOString().split('T')[0]
    setDatePickerStart(Math.min(...allYears) + '-01-01')
    setDatePickerEnd(currentDate)
  }

  /**
   * Update state for the date range when a change is made in the Year Selector
   * If the year selector is set to All Years, set the date range to all
   * Otherwise, set the date range to the first and last date of the selected year
   */
  function changeYearSelector(newYear) {
    if (newYear === 'all-years') {
      setAllYears()
      return
    }

    // Set start date
    setDatePickerStart(newYear + '-01-01')

    // Set end date
    const date = new Date()
    const currentDate = date.toISOString().split('T')[0]
    const currentYear = date.getFullYear().toString()
    const isCurrentYear = currentYear === newYear
    const newEndDate = isCurrentYear ? currentDate : newYear + '-12-31'
    setDatePickerEnd(newEndDate)
  }

  /** Generates date range components with dates matching the current date range state
   *  Component provided from UI library does not allow for direct setting of the value field
   *  Since defaultValue field is used to set the value, the component must be re-initialized when the dates change
   */
  function CreateDateRangePicker({ datePickerStart, datePickerEnd }) {
    return (
      <DateRangePicker
        className="custom-date-picker"
        startDateHint="mm/dd/yyyy"
        startDateLabel="Start date"
        startDatePickerProps={{
          onChange: (e) => {
            const [month, day, year] = e.split('/')
            const newDate = year + '-' + month + '-' + day
            setDatePickerStart(newDate)
          },
          defaultValue: datePickerStart,
          name: 'event-date-start',
        }}
        endDateHint="mm/dd/yyyy"
        endDateLabel="End date"
        endDatePickerProps={{
          onChange: (e) => {
            const [month, day, year] = e.split('/')
            const newDate = year + '-' + month + '-' + day
            setDatePickerEnd(newDate)
          },
          defaultValue: datePickerEnd,
          name: 'event-date-end',
        }}
      />
    )
  }

  return (
    <Fieldset legend="Select Year or Date Range" className="date-range-form">
      <Dropdown
        className="year-selector-dropdown"
        name="year-selector-dropdown"
        onChange={(e) => changeYearSelector(e.target.value)}
        disabled={isCustomDatesOpen}
        defaultValue={new Date().getFullYear().toString()}
      >
        <option key="all-years" value="all-years">
          {' '}
          - All Years -{' '}
        </option>
        {allYears.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </Dropdown>

      <NavDropDownButton
        className="expand-custom-date-picker"
        label="Expand Custom Date Range"
        isOpen={isCustomDatesOpen}
        onToggle={() => setCustomDatesOpen((prevIsOpen) => !prevIsOpen)}
      />

      {isCustomDatesOpen && (
        <CreateDateRangePicker
          datePickerStart={datePickerStart}
          datePickerEnd={datePickerEnd}
        />
      )}
    </Fieldset>
  )
}

export default DateRange
