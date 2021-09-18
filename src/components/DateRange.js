import React, { useEffect, useState } from 'react'
import { Grid } from '@trussworks/react-uswds'
import { Form, DateRangePicker, Dropdown } from '@trussworks/react-uswds'

import '../css/date.scss'

const DateRange = ({ allYears = ['2020', '2019', '2018'] }) => {
  const [year, setYear] = useState('')

  const date = new Date()
  const getYear = date.getFullYear()

  let handleYear = (e) => {
    setYear(e.target.value)
  }

  return (
    <>
      <Grid row>
        <Dropdown
          id="input-dropdown"
          name="input-dropdown"
          onChange={handleYear}
        >
          <option value={year}>- All Years -</option>
          {allYears.map((year) => (
            <option value={year}>{year}</option>
          ))}
        </Dropdown>
      </Grid>
      <Grid row>
        <Form onSubmit={function noRefCheck() {}} className="date-range-form">
          <DateRangePicker
            startDateHint="mm/dd/yyyy"
            startDateLabel="Event start date"
            startDatePickerProps={{
              defaultValue: !year ? getYear + '-01-01' : year + '-01-01',
              disabled: false,
              id: 'event-date-start',
              name: 'event-date-start',
            }}
            endDateHint="mm/dd/yyyy"
            endDateLabel="End date"
            endDatePickerProps={{
              defaultValue: '2021-01-25',
              disabled: false,
              id: 'event-date-end',
              name: 'event-date-end',
            }}
          />
        </Form>
      </Grid>
    </>
  )
}

export default DateRange
