import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema.ts'
import { isTest } from '../../env.ts'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not configured')
}

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, {
  prepare: false,
  onnotice: (msg) => {
    if (!isTest()) {
      console.warn(`Postgres Notice: [${msg.severity}] ${msg.message}`)
    }
  },
})
const db = drizzle({ client, schema })

export default db
