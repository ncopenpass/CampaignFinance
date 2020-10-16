const fs = require('fs')
const path = require('path')

const fileName = 'Data Dictionary NC Campaign Contributions UTF8.txt'
const outPath = path.join(
  __dirname,
  '..',
  'src',
  'static',
  'dataDictionary.json'
)

;(async () => {
  try {
    const [, , fileArg] = process.argv
    let filePath
    if (fileArg) {
      filePath = path.join(__dirname, '..', fileArg)
    } else {
      filePath = path.join(__dirname, '..', fileName)
    }
    if (!fs.existsSync(filePath)) {
      throw Error(`Provided file doesn\'t exist ${filePath}`)
    }
    let file = fs.readFileSync(filePath, { encoding: 'utf-8' })
    file = file.split('\n')

    const headers = file
      .shift()
      .split('\t')
      .map((value) =>
        value
          // do appropriate camel casing
          .replace(/(?:^\w[A-Z]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase()
          })
          // remove spaces
          .replace(/\s+/g, '')
      )

    const dictionary = []
    file
      .filter((row) => Boolean(row))
      .forEach((row) => {
        const entry = {}
        const values = row.split('\t')
        headers.forEach((header, index) => {
          entry[header] = values[index]
        })
        dictionary.push(entry)
      })

    fs.writeFileSync(outPath, JSON.stringify(dictionary, null, 2), 'utf8')
  } catch (e) {
    console.log('Error creating data dictionary:\n', e)
  }
})()
