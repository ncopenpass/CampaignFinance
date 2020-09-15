const fs = require('fs')
const path = require('path')

;(async () => {
  try {
    const [, , fileArg] = process.argv
    if (!fileArg) {
      throw Error('Please provide a filepath')
    }
    const filepath = path.join(__dirname, '..', fileArg)
    if (!fs.existsSync(filepath)) {
      throw Error(`Provided file doesn\'t exist ${filepath}`)
    }
    let file = fs.readFileSync(filepath, { encoding: 'utf-8' })
    file = file.split('\n')
    // ignore the headers line
    const headers = file
      .shift()
      .split(',')
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
        const values = row.split(',')
        headers.forEach((header, index) => {
          entry[header] = values[index]
        })
        dictionary.push(entry)
      })

    const outPath = path.join(
      __dirname,
      '..',
      'src',
      'static',
      'dataDictionary.json'
    )
    fs.writeFileSync(outPath, JSON.stringify(dictionary, null, 2), 'utf8')
  } catch (e) {
    console.log('Error creating data dictionary:\n', e)
  }
})()
