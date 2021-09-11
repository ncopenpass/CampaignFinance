import React from 'react'
import { GridContainer, Grid } from '@trussworks/react-uswds'
import { Form, DateRangePicker, Dropdown } from '@trussworks/react-uswds'

import '../css/date.scss'

const DateRange = () => {
  return (
    <GridContainer>
      <Grid row>
        <Grid col>
          <h2>Select a year or pick a date range</h2>
        </Grid>
      </Grid>
      <Grid row>
        <Grid col>
          <Dropdown id="input-dropdown" name="input-dropdown">
            <option value="value1">- Select Year -</option>
            <option value="value2">Option A</option>
            <option value="value3">Option B</option>
            <option value="value4">Option c</option>
          </Dropdown>
        </Grid>
        <Grid col>
          <Form onSubmit={function noRefCheck() {}} className="date-range-form">
            <DateRangePicker
              startDateHint="mm/dd/yyyy"
              startDateLabel="Event start date"
              startDatePickerProps={{
                defaultValue: '2021-01-20',
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
      </Grid>
    </GridContainer>
  )
}

export default DateRange
