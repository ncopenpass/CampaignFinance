const sanitize = require('sanitize-filename')
const { parse } = require('json2csv')

const handleError = (error, res) => {
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
 * @param {Array<Object>} data
 * @param {String} filename
 * @param {import('express').Response} res
 */
const sendCSV = (data, filename, res) => {
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

const streamFile = (streamFn, filename, res) => {
  console.log('filename', sanitize(filename))
  res.setHeader('Content-type', 'text/csv')
  res.setHeader(
    'Content-disposition',
    `attachment; filename="${sanitize(filename)}"`
  )
  return streamFn()
}

module.exports = { handleError, sendCSV, streamFile }
