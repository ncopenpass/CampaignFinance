const migrate = require('node-pg-migrate').default

const { getClient } = require('../db')
const { copyFromCSV } = require('../db/copyFromCSV')

require('dotenv').config()

const MIGRATIONS_TABLE_NAME = 'pgmigrations_test'

const dropTables = async (client) => {
  await client.query('drop table if exists committees')
  await client.query('drop table if exists contributions')
  await client.query('drop table if exists contributors')
  await client.query(`drop table if exists ${MIGRATIONS_TABLE_NAME}`)
}

const setUpDb = async () => {
  let client = null
  const config = {
    databaseUrl: process.env.TEST_DATABASE_URL,
    dir: `${__dirname}/../migrations`,
    direction: 'up',
    migrationsTable: MIGRATIONS_TABLE_NAME,
  }

  try {
    client = await getClient()
    console.log('Dropping existing tables from test db, if they exist')
    await dropTables(client)
    console.log('Running migrations to set up db')
    await migrate(config)
  } catch (error) {
    console.error(error)
  } finally {
    if (client !== null) {
      client.release()
    }
  }
}

const seedDb = async () => {
  let client = null
  try {
    client = await getClient()
    await copyFromCSV(
      `${__dirname}/fixtures/contributors.csv`,
      'contributors',
      client
    )
    await copyFromCSV(
      `${__dirname}/fixtures/contributions.csv`,
      'contributions',
      client
    )
    await copyFromCSV(
      `${__dirname}/fixtures/committees.csv`,
      'committees',
      client
    )
  } catch (error) {
    console.error(error)
  } finally {
    if (client !== null) client.release()
  }
}

const dropRows = async () => {
  let client = null
  try {
    client = await getClient()
    await client.query('truncate committees, contributions, contributors')
  } catch (err) {
    console.error(err)
  } finally {
    if (client !== null) client.release()
  }
}

const tearDownDb = async () => {
  let client = null
  try {
    client = await getClient()
    await dropTables(client)
  } catch (error) {
    console.error(error)
  } finally {
    if (client !== null) client.release()
  }
}

module.exports = {
  setUpDb,
  seedDb,
  tearDownDb,
  dropRows,
}
