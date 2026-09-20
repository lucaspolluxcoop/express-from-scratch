import db from '../../src/db/connection.ts'
import { users, habits, tags, entries, habitTags } from '../../src/db/schema.ts'
import { sql } from 'drizzle-orm'
import { execSync } from 'node:child_process'

export const setup = async () => {
  console.log('Setting up test db')
  
  try {
    await db.execute(sql`DROP TABLE IF EXISTS ${entries} CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS ${habits} CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS ${users} CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS ${tags} CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS ${habitTags} CASCADE`)

    console.log('Pushing schema using drizzle-kit')
    execSync(
      `pnpm exec drizzle-kit push --url="${process.env.DATABASE_URL}" --schema="./src/db/schema.ts" --dialect="postgresql"`,
      {
        stdio: 'inherit',
        cwd: process.cwd(),
      },
    )

    console.log('Test DB created')
  } catch (e) {
    console.log('failed to set up db', e)
    throw e
  }

  return async () => {
    try {
      await db.execute(sql`DROP TABLE IF EXISTS ${entries} CASCADE`)
      await db.execute(sql`DROP TABLE IF EXISTS ${habitTags} CASCADE`)
      await db.execute(sql`DROP TABLE IF EXISTS ${habits} CASCADE`)
      await db.execute(sql`DROP TABLE IF EXISTS ${users} CASCADE`)
      await db.execute(sql`DROP TABLE IF EXISTS ${tags} CASCADE`)
      db.$client.end()
    } catch (e) {
      console.log('failed to set up db', e)
      throw e
    }
  }
}
