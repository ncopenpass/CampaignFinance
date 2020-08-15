import React from 'react'
import { Button } from '@trussworks/react-uswds'

const ShareFeedback = () => {
  return (
    <a href="https://forms.gle/5c4dmuTPVCznSB1s8" target="_blank">
      <Button type="button" className="report-btn">
        Share Feedback
      </Button>
    </a>
  )
}

export default ShareFeedback
