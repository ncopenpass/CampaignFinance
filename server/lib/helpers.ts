import sanitize from 'sanitize-filename'
import { parse } from 'json2csv'
import { Response } from 'express'

export const handleError = (error: Error, res: Response) => {
  console.error(error)
  res.status(500)
  const { NODE_ENV } = process.env
  const message =
    NODE_ENV === 'development' || NODE_ENV === 'test'
      ? `unable to process request: ${error.message}`
      : 'unable to process request'
  res.send({ error: message })
}

/**
 * Takes an array of data and sends a CSV file
 * The field names of the first item in the array will be the header row
 */
export const sendCSV = (data: any[], filename: string, res: Response) => {
  console.log('filename', sanitize(filename))
  res.setHeader('Content-type', 'text/csv')
  res.setHeader(
    'Content-disposition',
    `attachment; filename="${sanitize(filename)}"`
  )

  const fields = Object.keys(data[0])
  const csv = parse(data, { fields })
  res.send(csv)
}

export const streamFile = (
  streamFn: () => Promise<any>,
  filename: string,
  res: Response
) => {
  console.log('filename', sanitize(filename))
  res.setHeader('Content-type', 'text/csv')
  res.setHeader(
    'Content-disposition',
    `attachment; filename="${sanitize(filename)}"`
  )
  return streamFn()
}
