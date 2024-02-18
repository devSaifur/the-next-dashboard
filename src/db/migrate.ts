import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { Pool } from 'pg'
import { db } from '@/db'

const main = async () => {
  const poll = new Pool({ connectionString: process.env.DATABASE_URL! })

  console.log('Migration running')

  try {
    await migrate(db, { migrationsFolder: 'src/db/migrations' })
  } catch (err) {
    console.error(err)
  }

  console.log('Migration done, exiting...')

  await poll.end()
}

main()
