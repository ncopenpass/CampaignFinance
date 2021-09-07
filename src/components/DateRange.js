import React from 'react'
import { Form, DateRangePicker, Dropdown } from '@trussworks/react-uswds'

const DateRange = () => {
  return (
    <>
      <Dropdown id="input-dropdown" name="input-dropdown">
        <option value="value1">- Current Election Cycle -</option>
        <option value="value2">Option A</option>
        <option value="value3">Option B</option>
        <option value="value4">Option c</option>
      </Dropdown>
      <Form onSubmit={function noRefCheck() {}}>
        <DateRangePicker
          endDateHint="mm/dd/yyyy"
          endDateLabel="Event end date"
          endDatePickerProps={{
            defaultValue: '2021-01-25',
            disabled: false,
            id: 'event-date-end',
            name: 'event-date-end',
          }}
          startDateHint="mm/dd/yyyy"
          startDateLabel="Event start date"
          startDatePickerProps={{
            defaultValue: '2021-01-20',
            disabled: false,
            id: 'event-date-start',
            name: 'event-date-start',
          }}
        />
      </Form>
    </>
  )
}

export default DateRange
